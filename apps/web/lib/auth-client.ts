"use client";

import { useMemo, useSyncExternalStore } from "react";

const TOKEN_KEY = "clout_token";
const AUTH_EVENT = "clout-auth-changed";

function emitAuthChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
}

export function getCloutToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
}

export function setCloutToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(TOKEN_KEY, token);
  emitAuthChange();
}

export function clearCloutToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(TOKEN_KEY);
  emitAuthChange();
}

export function getDiscordOAuthUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const redirectUri =
    process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI ||
    `${apiUrl.replace(/\/$/, "")}/auth/callback`;
  const scope = "identify guilds email";

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope,
  });
  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent): void => {
    if (event.key === TOKEN_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(AUTH_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(AUTH_EVENT, onStoreChange);
  };
}

function getSnapshot(): string | null {
  return getCloutToken();
}

export interface CloutSession {
  isAuthenticated: boolean;
  loginUrl: string;
  token: string | null;
}

export function useCloutSession(): CloutSession {
  const token = useSyncExternalStore(subscribe, getSnapshot, () => null);
  const loginUrl = useMemo(() => getDiscordOAuthUrl(), []);

  return {
    token,
    isAuthenticated: Boolean(token),
    loginUrl,
  };
}
