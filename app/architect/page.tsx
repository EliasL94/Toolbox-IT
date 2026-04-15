'use client';

import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Send, Bot, User, Cpu } from 'lucide-react';

export default function ArchitectPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Bonjour ! Je suis l'Architecte IA de Toolbox-IT. Décrivez-moi les objectifs de votre projet, ou posez-moi des questions sur le rapport de l'analyseur pour que je vous propose des solutions d'architecture."
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    
    // Mock response
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: "En analysant vos besoins, je vous recommande d'utiliser le pattern « Repository ». Cela vous permettra d'abstraire vos requêtes de base de données hors de vos contrôleurs, et simplifiera grandement l'écriture de vos tests unitaires. Souhaitez-vous un exemple de structure de dossiers ?" 
        }
      ]);
    }, 1500);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 pb-32 flex flex-col min-h-[90vh]">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">IA Architecte</h1>
            <p className="text-sm text-slate-500">Posez vos questions de conception</p>
          </div>
        </div>
      </header>

      <GlassCard className="flex-1 flex flex-col p-4 sm:p-6 mb-6 min-h-[400px]">
        <div className="flex-1 overflow-y-auto space-y-6 pb-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex shrink-0 h-10 w-10 items-center justify-center rounded-full ${msg.role === 'assistant' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                {msg.role === 'assistant' ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${msg.role === 'user' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700/50'}`}>
                <p className="text-[15px] leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ex: Comment implémenter l'injection de dépendances ?" 
              className="w-full rounded-full border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 py-3.5 pl-6 pr-14 text-sm outline-none backdrop-blur-md focus:border-violet-500 dark:focus:border-violet-500 transition-colors"
            />
            <Button 
              type="submit" 
              size="sm" 
              variant="primary"
              className="absolute right-2 !rounded-full h-9 w-9 p-0 flex items-center justify-center bg-violet-600 hover:bg-violet-700 dark:bg-violet-600"
              disabled={!input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </GlassCard>
    </div>
  );
}
