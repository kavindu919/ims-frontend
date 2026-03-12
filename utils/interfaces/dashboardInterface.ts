export interface Stats {
  inventory: {
    total: number;
    in_store: number;
    borrowed: number;
    damaged: number;
    missing: number;
  };
  storage: { cupboards: number; places: number };
  users: { total: number; active: number };
  borrows: { active: number; overdue: number };
}

export interface RecentLog {
  id: number;
  action: string;
  subject_type: string | null;
  subject_id: number | null;
  created_at: string;
  user: { id: number; name: string };
}
