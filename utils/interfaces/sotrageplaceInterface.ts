export interface StoragePlaceQueryProps {
  search: string;
  cupboard_id?: number | "";
  sortBy: string;
  sortOrder: string;
  page: number;
  limit: number;
}

export interface StoragePlace {
  id: number;
  name: string;
  cupboard_id: number;
  description: string | null;
  inventory_items_count: number;
  cupboard: { id: number; name: string };
  created_at: string;
}
