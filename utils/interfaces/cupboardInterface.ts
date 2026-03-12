export interface CreateCupboardInterface {
  name: string;
  location: string;
  description: string;
}

export interface CupboardProps {
  id: number;
  name: string;
  location: string | null;
  description: string | null;
  storage_places_count: number;
  created_at: string;
}

export interface CupboardQueryProps {
  search: string;
  sortBy: string;
  sortOrder: string;
  page?: number;
  limit?: number;
}
