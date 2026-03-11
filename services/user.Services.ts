import api from "@/lib/axios";
import { UserQueryProps } from "@/utils/interfaces/userInterface";

export const fetchAllUsers = async (query: UserQueryProps) => {
  try {
    const params = { ...query };
    if (params.is_active === "") delete (params as any).is_active;
    const res = await api.get("/auth/users", { params });
    return res.data;
  } catch (error: any) {
    const errorMessage = error?.message || error?.response?.data?.message;
    throw new Error(errorMessage);
  }
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  try {
    const res = await api.post("/auth/users", data);
    return res.data;
  } catch (error: any) {
    const errorMessage = error?.message || error?.response?.data?.message;
    throw new Error(errorMessage);
  }
};

export const updateUser = async (data: {
  id: number;
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  is_active?: boolean;
}) => {
  try {
    const res = await api.post("/auth/user/update", data);
    return res.data;
  } catch (error: any) {
    const errorMessage = error?.message || error?.response?.data?.message;
    throw new Error(errorMessage);
  }
};
