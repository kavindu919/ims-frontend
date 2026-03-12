import api from "@/lib/axios";

export const fetchDashboardStats = async () => {
  try {
    const res = await api.get("/auth/dashboard");
    return res.data;
  } catch (error: any) {
    const errorMessage = error?.message || error?.response?.data?.message;
    throw new Error(errorMessage);
  }
};
