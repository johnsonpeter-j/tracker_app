import type { AxiosError } from "axios";
import axios from "axios";

export type ApiError = {
  message: string;
  statusCode?: number;
  details?: unknown;
};

export const client = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});

const AUTH_STORAGE_KEY = "tracker-auth-state";

client.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

export function normaliseError(error: unknown): ApiError {
  if (isAxiosError(error)) {
    const statusCode = error.response?.status;
    const message = extractMessage(error);

    return {
      message,
      statusCode,
      details: error.response?.data ?? error,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "Unexpected error occurred.", details: error };
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      const fallbackToken = window.localStorage.getItem("access_token");
      return fallbackToken ?? null;
    }

    const parsed = JSON.parse(raw) as { token?: string } | null;
    if (parsed?.token) {
      return parsed.token;
    }

    return null;
  } catch (error) {
    console.warn("Failed to parse stored auth state", error);
    return null;
  }
}


function isAxiosError(payload: unknown): payload is AxiosError {
  return axios.isAxiosError(payload);
}

function extractMessage(error: AxiosError): string {
  if (typeof error.response?.data === "string") {
    return error.response.data;
  }

  if (
    error.response?.data &&
    typeof error.response.data === "object" &&
    "message" in error.response.data
  ) {
    const message = (error.response.data as Record<string, unknown>).message;
    if (typeof message === "string") {
      return message;
    }
  }

  return error.message ?? "Request failed";
}

