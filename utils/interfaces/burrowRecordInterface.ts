export interface BorrowQueryProps {
  search: string;
  status: string;
  sortBy: string;
  sortOrder: string;
  page: number;
  limit: number;
}

export interface BorrowFilterProps {
  search: string;
  status: string;
  sortBy: string;
  sortOrder: string;
}

export interface BorrowRecord {
  id: number;
  item_id: number;
  borrower_name: string;
  contact: string;
  borrow_date: string;
  expected_return_date: string;
  return_date: string | null;
  quantity_borrowed: number;
  status: string;
  notes: string | null;
  created_at: string;
  item: { id: number; name: string; code: string };
  created_by: { id: number; name: string };
}
