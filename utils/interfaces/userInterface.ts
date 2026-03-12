export interface UserQueryProps {
  search: string;
  role: string;
  is_active: string;
  sortBy: string;
  sortOrder: string;
  page: number;
  limit: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  created_by: { id: number; name: string } | null;
}
