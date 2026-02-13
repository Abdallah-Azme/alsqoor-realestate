"use client";

import { api, ApiError } from "@/lib/api-client";
import { removeToken, getToken } from "@/services";
import { useTranslations } from "next-intl";
import { createContext, useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";
import { User } from "@/types";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  loading: boolean;
  fetchUserProfile: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

interface UserContextProviderProps {
  children: ReactNode;
}

export default function UserContextProvider({
  children,
}: UserContextProviderProps) {
  const t = useTranslations("common");
  // Initialize state with null to avoid SSR issues
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from API
  async function fetchUserProfile() {
    try {
      const token = await getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const data = await api.get<any>("/profile");

      // api.get auto-unwraps .data, so data is the profile payload
      const apiUser = data?.data || data;
      const mappedUser: User = {
        ...apiUser,
        phone: apiUser.mobile || apiUser.phone, // Map mobile to phone
        points: apiUser.pointsBalance,
      };
      setUser(mappedUser);
    } catch (error) {
      // Handle 401 - token is invalid/expired
      if (error instanceof ApiError && error.code === 401) {
        setUser(null);
        await removeToken();
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      } else {
        console.error("Error fetching user profile:", error);
        setUser(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
        }
      }
    } finally {
      setLoading(false);
    }
  }

  // Load user from localStorage on client-side mount and fetch fresh profile
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem("user");
        }
      }

      // Fetch fresh profile data from API
      fetchUserProfile();
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    }
  }, [user]);

  async function logout() {
    try {
      await api.post("/logout", {});

      // Clear local state
      setUser(null);
      await removeToken();

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }

      toast.success(t("logout_success"));
    } catch (error) {
      // Still clear local state even on error
      setUser(null);
      await removeToken();

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }

      console.error("Logout error:", error);
    }
  }

  return (
    <UserContext.Provider
      value={{ user, setUser, logout, loading, fetchUserProfile }}
    >
      {children}
    </UserContext.Provider>
  );
}
