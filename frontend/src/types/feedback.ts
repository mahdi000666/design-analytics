export type FeedbackCategory = 'Revision' | 'Approval' | 'Question';
export type FeedbackStatus   = 'Pending' | 'InProgress' | 'Resolved';

export interface Feedback {
  readonly id:           number;
  readonly project_name: string;
  readonly submitted_at: string;
  readonly resolved_at:  string | null;
  project:      number;
  category:     FeedbackCategory;
  content_text: string;
  status:       FeedbackStatus;
}

export interface FeedbackPayload {
  project:      number;
  category:     FeedbackCategory;
  content_text: string;
}