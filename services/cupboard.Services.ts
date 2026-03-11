import api from "@/lib/axios";
import { CupboardQueryProps } from "@/utils/interfaces/cupboardInterface";

export const fetchAllCupboards = async (query: CupboardQueryProps) => {
  try {
    const res = await api.get("/auth/cupboards", { params: query });
    return res.data;
  } catch (error: any) {
    const errorMessage = error?.message || error?.response?.data?.message;
    throw new Error(errorMessage);
  }
};

export const createCupboard = async (data: {
  name: string;
  location?: string;
  description?: string;
}) => {
  try {
    const res = await api.post("/auth/cupboards/create", data);
    return res.data;
  } catch (error: any) {
    const errorMessage = error?.message || error?.response?.data?.message;
    throw new Error(errorMessage);
  }
};

export const deleteCupboard = async (id: number) => {
  try {
    const res = await api.post("/auth/cupboard/delete", { id });
    return res.data;
  } catch (error: any) {
    const errorMessage = error?.message || error?.response?.data?.message;
    throw new Error(errorMessage);
  }
};

export const updateCupboard = async (data: {
  id: number;
  name: string;
  location?: string;
  description?: string;
}) => {
  try {
    const res = await api.post("/auth/cupboard/update", data);
    return res.data;
  } catch (error: any) {
    const errorMessage = error?.message || error?.response?.data?.message;
    throw new Error(errorMessage);
  }
};
