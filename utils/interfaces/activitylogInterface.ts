export interface ActivityLogQueryProps {
  action: string;
  user_id: string;
  from: string;
  to: string;
  sortOrder: string;
  page: number;
  limit: number;
}

export interface QueryProps {
  action: string;
  user_id: string;
  from: string;
  to: string;
  sortOrder: string;
}

export interface ActivityLog {
  id: number;
  action: string;
  subject_type: string | null;
  subject_id: number | null;
  old_value: Record<string, any> | null;
  new_value: Record<string, any> | null;
  created_at: string;
  user: { id: number; name: string; email: string };
}
