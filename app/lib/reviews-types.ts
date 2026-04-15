export type ReviewStatus = "pending" | "processing" | "completed" | "failed";

export type ReviewReport = {
  architecture: {
    score: number;
    summary: string;
    improvements: string[];
  };
  security: {
    score: number;
    issues_found: number;
  };
  general_feedback: string;
};

export type ReviewEntity = {
  id: string;
  status: ReviewStatus;
  repository_url: string;
  branch: string;
  created_at: string;
  completed_at?: string;
  progress?: number;
  message?: string;
  error_message?: string;
  report?: ReviewReport;
};

export type ReviewCreateInput = {
  repository_url: string;
  branch?: string;
};
