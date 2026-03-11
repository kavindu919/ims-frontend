import api from "@/lib/axios";
import { StoragePlaceQueryProps } from "@/utils/interfaces/sotrageplaceInterface";

export const fetchAllStoragePlaces = async (query: StoragePlaceQueryProps) => {
  try {
    const res = await api.get("/auth/storage-places", { params: query });
    return res.data;
  } catch (error: any) {
    const errorMessage = error?.message || error?.response?.data?.message;
    throw new Error(errorMessage);
  }
};

export const createStoragePlace = async (data: {
  name: string;
  cupboard_id: number;
  description?: string;
}) => {
  try {
    const res = await api.post("/auth/storage-places", data);
    return res.data;
  } catch (error: any) {
    const errorMessage = error?.message || error?.response?.data?.message;
    throw new Error(errorMessage);
  }
};

export const updateStoragePlace = async (data: {
  id: number;
  name: string;
  cupboard_id: number;
  description?: string;
}) => {
  try {
    const res = await api.post("/auth/storage-place/update", data);
    return res.data;
  } catch (error: any) {
    const errorMessage = error?.message || error?.response?.data?.message;
    throw new Error(errorMessage);
  }
};

export const deleteStoragePlace = async (id: number) => {
  try {
    const res = await api.post("/auth/storage-place/delete", { id });
    return res.data;
  } catch (error: any) {
    const errorMessage = error?.message || error?.response?.data?.message;
    throw new Error(errorMessage);
  }
};
