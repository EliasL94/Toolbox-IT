'use client';

import React, { useState, useRef, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Send, Bot, User, Cpu, Loader2, FolderGit2 } from 'lucide-react';
import type { ReviewData } from '@/lib/store';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ArchitectPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Bonjour ! Je suis l'Architecte IA de Toolbox-IT. Décrivez-moi les objectifs de votre projet, ou posez-moi des questions sur le rapport de l'analyseur pour que je vous propose des solutions d'architecture."
    }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // States pour la sélection du contexte
  const [reviewsHistory, setReviewsHistory] = useState<ReviewData[]>([]);
  const [selectedReviewId, setSelectedReviewId] = useState<string>('');

  // Auto-scroll vers le bas à chaque nouveau message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Chargement de l'historique et du paramètre d'URL au montage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rid = params.get('reviewId');
    if (rid) {
      setSelectedReviewId(rid);
    }

    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/v1/reviews');
        if (response.ok) {
          const data = await response.json();
          // Ne garder que les completed pour le contexte
          setReviewsHistory(data.filter((r: ReviewData) => r.status === 'completed' && r.report));
        }
      } catch (error) {
        console.error("Erreur de chargement de l'historique:", error);
      }
    };
    fetchHistory();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsStreaming(true);

    // Ajouter un message placeholder pour l'assistant
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/v1/architect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          reviewId: selectedReviewId || undefined, // On envoie le contexte si sélectionné
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: `⚠️ ${data.error || 'Erreur de connexion à l\'IA.'}`,
          };
          return updated;
        });
        setIsStreaming(false);
        return;
      }

      // Lire le stream SSE
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Pas de stream disponible.');
      }

      const processSSELine = (line: string) => {
        if (!line.startsWith('data: ')) return;
        const payload = line.slice(6);
        if (payload === '[DONE]') return;
        try {
          const parsed = JSON.parse(payload);
          if (parsed.text) {
            setMessages(prev => {
              const updated = [...prev];
              const lastMsg = updated[updated.length - 1];
              updated[updated.length - 1] = {
                ...lastMsg,
                content: lastMsg.content + parsed.text,
              };
              return updated;
            });
          }
          if (parsed.error) {
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: 'assistant',
                content: `⚠️ ${parsed.error}`,
              };
              return updated;
            });
          }
        } catch {
          // Ignorer les lignes mal formées
        }
      };

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          processSSELine(line);
        }
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: '⚠️ Impossible de contacter le serveur. Vérifiez votre connexion.',
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 pt-28 pb-8 flex flex-col min-h-[90vh]">
      <header className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex shrink-0 items-center justify-center h-12 w-12 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">IA Architecte</h1>
            <p className="text-sm text-slate-500">Posez vos questions de conception</p>
          </div>
        </div>

        {/* Sélecteur de contexte d'analyse */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
            <FolderGit2 className="h-4 w-4" />
          </div>
          <select 
            value={selectedReviewId}
            onChange={(e) => setSelectedReviewId(e.target.value)}
            disabled={isStreaming || messages.length > 1} // Désactivé une fois la conversation commencée
            className="text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 py-2 pl-3 pr-8 outline-none focus:border-violet-500 transition-colors disabled:opacity-50"
          >
            <option value="">Aucun contexte spécifique</option>
            {reviewsHistory.map(r => (
              <option key={r.id} value={r.id}>
                {r.repository_url.replace('https://github.com/', '')}
              </option>
            ))}
          </select>
        </div>
      </header>
      
      {selectedReviewId && messages.length <= 1 && (
        <div className="mb-4 px-4 py-2 text-xs text-violet-700 dark:text-violet-300 bg-violet-100/50 dark:bg-violet-900/20 rounded-lg border border-violet-200 dark:border-violet-800/50 text-center">
          💡 En envoyant votre premier message, l&apos;IA prendra en compte les résultats de l&apos;analyse sélectionnée ci-dessus.
        </div>
      )}

      <GlassCard className="flex-1 flex flex-col p-4 sm:p-6 mb-6 min-h-[400px]">
        <div className="flex-1 overflow-y-auto space-y-6 pb-6 pr-2">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex shrink-0 h-10 w-10 items-center justify-center rounded-full ${msg.role === 'assistant' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                {msg.role === 'assistant' ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
              </div>
              <div className={`max-w-[85%] rounded-2xl px-5 py-4 ${msg.role === 'user' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700/50'}`}>
                {msg.content ? (
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <div className="flex items-center gap-2 text-indigo-500">
                    <Loader2 className="h-5 w-5 animate-spin" /> Je réfléchis à votre projet...
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isStreaming}
              placeholder="Ex: Pourquoi ai-je un score faible en architecture ?" 
              className="w-full rounded-full border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 py-3.5 pl-6 pr-14 text-sm outline-none backdrop-blur-md focus:border-violet-500 dark:focus:border-violet-500 transition-colors disabled:opacity-50"
            />
            <Button 
              type="submit" 
              size="sm" 
              variant="primary"
              className="absolute right-2 !rounded-full h-9 w-9 p-0 flex items-center justify-center bg-violet-600 hover:bg-violet-700 dark:bg-violet-600"
              disabled={!input.trim() || isStreaming}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </GlassCard>
    </div>
  );
}
