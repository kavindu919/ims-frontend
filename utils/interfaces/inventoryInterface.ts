export interface InventoryQueryFilterProps {
  search: string;
  status: string;
  storage_place_id: number | "";
  sortBy: string;
  sortOrder: string;
}

export interface InventoryQueryProps {
  search: string;
  status: string;
  storage_place_id: number | "";
  sortBy: string;
  sortOrder: string;
  page: number;
  limit: number;
}

export interface InventoryItem {
  id: number;
  name: string;
  code: string;
  quantity: number;
  serial_number: string | null;
  image_path: string | null;
  description: string | null;
  storage_place_id: number;
  status: string;
  created_at: string;
  storage_place: {
    id: number;
    name: string;
    cupboard: { id: number; name: string };
  };
}
