import api from "@/lib/axios";

export const fetchAllCupboards = async () => {
  try {
    const res = await api.get("/auth/cupboards");
    return res.data;
  } catch (error: any) {
    const errorMessage =
      error?.message || error?.response?.data?.message || "Login failed";
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
    const errorMessage =
      error?.message || error?.response?.data?.message || "Login failed";
    throw new Error(errorMessage);
  }
};
