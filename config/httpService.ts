"use client";
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = "https://prepforabackend-production.up.railway.app";

const ACCESS_TOKEN_KEY = "prepfora_admin_access_token";
const REFRESH_TOKEN_KEY = "prepfora_admin_refresh_token";
const ADMIN_USER_KEY = "prepfora_admin_user";

// ─── Token Storage ────────────────────────────────────────────────────────────
let inMemoryAccessToken: string | null = null;

export const tokenStorage = {
  getAccess: (): string | null => {
    if (inMemoryAccessToken) return inMemoryAccessToken;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (stored) {
        inMemoryAccessToken = stored;
        return stored;
      }
    }
    return null;
  },
  setAccess: (token: string) => {
    inMemoryAccessToken = token;
    if (typeof window !== "undefined") {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
  },
  clearAccess: () => {
    inMemoryAccessToken = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  },

  getRefresh: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
  },
  setRefresh: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
  },
  clearRefresh: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },

  clearAll: () => {
    inMemoryAccessToken = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
    }
  },
};

/** Clears tokens and client session keys. Safe to call from UI or interceptors. */
export function clearSession() {
  tokenStorage.clearAll();
}

// ─── Axios Instances ──────────────────────────────────────────────────────────

export const httpService = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
});

export const unsecureHttpService = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
});

// ─── Refresh Token Logic ──────────────────────────────────────────────────────

let isRefreshing = false;

type PromiseExecutor = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};
let failedQueue: PromiseExecutor[] = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token as string);
  });
  failedQueue = [];
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefresh();
  if (!refreshToken) throw new Error("No refresh token available");

  const response = await unsecureHttpService.post<{
    success: boolean;
    data?: {
      access_token: string;
      refresh_token?: string;
    };
  }>("/admin/auth/refresh-token", { refresh_token: refreshToken });

  const data = response.data?.data;
  if (!data?.access_token) {
    throw new Error("Failed to refresh access token");
  }

  tokenStorage.setAccess(data.access_token);
  if (data.refresh_token) {
    tokenStorage.setRefresh(data.refresh_token);
  }
  return data.access_token;
}

// ─── Unsecured Instance Interceptors ─────────────────────────────────────────

unsecureHttpService.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError<unknown>): Promise<never> => Promise.reject(error)
);

// ─── Secured Instance — Request Interceptor ───────────────────────────────────

httpService.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = tokenStorage.getAccess();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError<unknown>): Promise<never> => Promise.reject(error)
);

// ─── Secured Instance — Response Interceptor (handles 401 + refresh) ─────────

httpService.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,

  async (error: AxiosError<unknown>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers.set("Authorization", `Bearer ${token}`);
            resolve(httpService(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const newToken = await refreshAccessToken();
      processQueue(null, newToken);
      originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
      return httpService(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearSession();

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default httpService;