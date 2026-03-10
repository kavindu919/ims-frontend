"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, UserContextType } from "@/utils/interfaces/authInterface";
import { fetchUserLogout, fetchUserProfile } from "@/services/auth.Services";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        setUser(null);
        return;
      }

      try {
        setLoading(true);
        const res = await fetchUserProfile();
        setUser(res);
        setError(null);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setError("Session expired. Please login again.");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      const res = await fetchUserLogout();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setError(null);
      toast.success(res.message || "Logged out successfully.");
      router.push("/login");
    } catch (error: any) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      toast.error(error.message || "Logout failed.");
      router.push("/login");
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, error, logout, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within UserProvider");
  }
  return context;
};
