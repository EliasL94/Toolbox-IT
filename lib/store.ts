import { PrismaClient } from '@prisma/client';

// Initialisation sûre pour éviter de multiplier les connexions en mode développement
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// --- AUTHS & USERS ---

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string | Date;
}

export async function saveUser(user: Partial<User> & { email: string; name: string; passwordHash: string }) {
  const newUser = await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
    },
  });
  return { ...newUser, createdAt: newUser.createdAt.toISOString() };
}

export async function getUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) return undefined;
  return { ...user, createdAt: user.createdAt.toISOString() };
}

export function generateUserId(): string {
  // Optionnel maintenant car Prisma gère l'UUID automatiquement
  return `usr_${Date.now()}`;
}

// --- REVIEWS ---

export interface ReviewReport {
  architecture: {
    score: number;
    pattern_detected: string;
    summary: string;
    strengths: string[];
    improvements: string[];
  };
  code_quality: {
    score: number;
    summary: string;
    strengths: string[];
    issues: string[];
  };
  security: {
    score: number;
    summary: string;
    issues_found: number;
    details: string[];
  };
  general_feedback: string;
}

export interface ReviewData {
  id: string;
  userId: string;
  status: "pending" | "processing" | "completed" | "failed";
  repository_url: string;
  branch: string;
  created_at: string;
  completed_at?: string;
  report?: ReviewReport;
  error_message?: string;
}

export async function saveReview(review: ReviewData) {
  const existing = await prisma.review.findUnique({ where: { id: review.id } });

  const dataToSave = {
    userId: review.userId,
    status: review.status,
    repository_url: review.repository_url,
    branch: review.branch,
    created_at: new Date(review.created_at),
    completed_at: review.completed_at ? new Date(review.completed_at) : null,
    report: review.report ? JSON.stringify(review.report) : null,
    error_message: review.error_message || null,
  };

  if (existing) {
    await prisma.review.update({
      where: { id: review.id },
      data: dataToSave,
    });
  } else {
    await prisma.review.create({
      data: {
        id: review.id,
        ...dataToSave,
      },
    });
  }
}

function mapPrismaReview(pr: any): ReviewData {
  return {
    id: pr.id,
    userId: pr.userId,
    status: pr.status as any,
    repository_url: pr.repository_url,
    branch: pr.branch,
    created_at: pr.created_at.toISOString(),
    completed_at: pr.completed_at ? pr.completed_at.toISOString() : undefined,
    report: pr.report ? JSON.parse(pr.report) : undefined,
    error_message: pr.error_message || undefined,
  };
}

export async function getReview(id: string): Promise<ReviewData | undefined> {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) return undefined;
  return mapPrismaReview(review);
}

export async function getAllReviews(userId?: string): Promise<ReviewData[]> {
  const reviews = await prisma.review.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { created_at: 'desc' },
  });
  return reviews.map(mapPrismaReview);
}

export function generateReviewId(): string {
  // Utilisé par le code métier pour fixer l'ID manuellement avant insertion.
  return `rev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export async function deleteReview(id: string, userId: string): Promise<boolean> {
  const review = await prisma.review.findUnique({ where: { id } });
  if (review && review.userId === userId) {
    await prisma.review.delete({ where: { id } });
    return true;
  }
  return false;
}
