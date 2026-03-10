import api from "@/lib/axios";

export const fetchUserLogin = async (email: string, password: string) => {
  try {
    const res = await api.post("/login", {
      email,
      password,
    });
    return res.data;
  } catch (error: any) {
    const errorMessage =
      error?.message || error?.response?.data?.message || "Login failed";
    throw new Error(errorMessage);
  }
};

export const fetchUserProfile = async () => {
  try {
    const res = await api.get("/auth/profile");
    return res.data;
  } catch (error: any) {
    const errorMessage =
      error?.message || error?.response?.data?.message || "Login failed";
    throw new Error(errorMessage);
  }
};

export const fetchUserLogout = async () => {
  try {
    const res = await api.post("/auth/logout");
    return res.data;
  } catch (error: any) {
    const errorMessage =
      error?.message || error?.response?.data?.message || "Login failed";
    throw new Error(errorMessage);
  }
};
