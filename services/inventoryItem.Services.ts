import api from "@/lib/axios";
import { InventoryQueryProps } from "@/utils/interfaces/inventoryInterface";

export const fetchAllInventoryItems = async (query: InventoryQueryProps) => {
  try {
    const res = await api.get("/auth/inventory-items", { params: query });
    return res.data;
  } catch (error: any) {
    const errorMessage = error?.message || error?.response?.data?.message;
    throw new Error(errorMessage);
  }
};

export const createInventoryItem = async (data: FormData) => {
  try {
    const res = await api.post("/auth/inventory-items", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error: any) {
    const errorMessage = error?.message || error?.response?.data?.message;
    throw new Error(errorMessage);
  }
};

export const updateInventoryItem = async (data: FormData) => {
  try {
    const res = await api.post("/auth/inventory-item/update", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error: any) {
    const errorMessage = error?.message || error?.response?.data?.message;
    throw new Error(errorMessage);
  }
};

export const deleteInventoryItem = async (id: number) => {
  try {
    const res = await api.post("/auth/inventory-item/delete", { id });
    return res.data;
  } catch (error: any) {
    const errorMessage = error?.message || error?.response?.data?.message;
    throw new Error(errorMessage);
  }
};

export const adjustItemQuantity = async (data: {
  id: number;
  type: "increment" | "decrement";
  amount: number;
  reason?: string;
}) => {
  try {
    const res = await api.post("/auth/inventory-item/adjust-quantity", data);
    return res.data;
  } catch (error: any) {
    const errorMessage = error?.message || error?.response?.data?.message;
    throw new Error(errorMessage);
  }
};

export const changeItemStatus = async (data: {
  id: number;
  status: string;
}) => {
  try {
    const res = await api.post("/auth/inventory-item/change-status", data);
    return res.data;
  } catch (error: any) {
    const errorMessage = error?.message || error?.response?.data?.message;
    throw new Error(errorMessage);
  }
};
