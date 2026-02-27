"use server";

import { cookies } from "next/headers";

export async function setToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 2, // 2 hours (matches acessExpiresIn)
  });
}

export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value || null;
}

export async function removeToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}

export async function saveRefreshToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("refresh_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days (matches refreshExpiresin)
  });
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("refresh_token")?.value || null;
}

export async function clearRefreshToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("refresh_token");
}
