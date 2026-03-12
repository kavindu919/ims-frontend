import api from "@/lib/axios";
import { BorrowQueryProps } from "@/utils/interfaces/burrowRecordInterface";

export const fetchAllBorrowRecords = async (query: BorrowQueryProps) => {
  try {
    const res = await api.get("/auth/borrow-records", { params: query });
    return res.data;
  } catch (error: any) {
    const errorMessage = error?.message || error?.response?.data?.message;
    throw new Error(errorMessage);
  }
};

export const createBorrowRecord = async (data: {
  item_id: number;
  borrower_name: string;
  contact: string;
  borrow_date: string;
  expected_return_date: string;
  quantity_borrowed: number;
  notes?: string;
}) => {
  try {
    const res = await api.post("/auth/borrow-records", data);
    return res.data;
  } catch (error: any) {
    const errorMessage = error?.message || error?.response?.data?.message;
    throw new Error(errorMessage);
  }
};

export const returnBorrowedItem = async (id: number) => {
  try {
    const res = await api.post("/auth/borrow-record/return", { id });
    return res.data;
  } catch (error: any) {
    const errorMessage = error?.message || error?.response?.data?.message;
    throw new Error(errorMessage);
  }
};

export const getBorrowRecord = async (id: number) => {
  try {
    const res = await api.post("/auth/borrow-record/get", { id });
    return res.data;
  } catch (error: any) {
    const errorMessage = error?.message || error?.response?.data?.message;
    throw new Error(errorMessage);
  }
};
