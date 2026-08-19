"use client";
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const BASE_URL = "https://prepforabackend-production.up.railway.app"

// ─── Token Storage ────────────────────────────────────────────────────────────
// Prefer memory for access token (XSS-safe); only refresh token goes to httpOnly
// cookie (handled server-side). If you can't use httpOnly cookies, use
// localStorage ONLY for the refresh token — never for the access token.

let inMemoryAccessToken: string | null = null;

export const tokenStorage = {
  getAccess: () => inMemoryAccessToken,
  setAccess: (token: string) => {
    inMemoryAccessToken = token;
  },
  clearAccess: () => {
    inMemoryAccessToken = null;
  },

  // Refresh token in localStorage only if httpOnly cookie isn't an option
  getRefresh: () => localStorage.getItem("hiroek_refresh_token"),
  setRefresh: (token: string) => localStorage.setItem("hiroek_refresh_token", token),
  clearRefresh: () => localStorage.removeItem("hiroek_refresh_token"),

  clearAll: () => {
    inMemoryAccessToken = null;
    localStorage.removeItem("hiroek_refresh_token");
  },
};

/** Clears tokens and client session keys. Safe to call from UI or interceptors. */
export function clearSession() {
  tokenStorage.clearAll();
  if (typeof window === "undefined") return;
  localStorage.removeItem("hiroekuserid");
  localStorage.removeItem("hiroekuserrole");
}

// ─── Axios Instances ──────────────────────────────────────────────────────────

export const httpService = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
});

export const unsecureHttpService = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
});

// ─── Refresh Token Logic ──────────────────────────────────────────────────────

let isRefreshing = false;

// Queue of { resolve, reject } for requests that arrived during a refresh
type PromiseExecutor = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};
let failedQueue: PromiseExecutor[] = [];

/**
 * Drain the queue: resolve every waiting request with the new token,
 * or reject them all if the refresh itself failed.
 */
// function processQueue(error: unknown, token: string | null = null) {
//   failedQueue.forEach(({ resolve, reject }) => {
//     if (error) reject(error);
//     else resolve(token as string);
//   });
//   failedQueue = [];
// }

// async function refreshAccessToken(): Promise<string> {
//   const refreshToken = tokenStorage.getRefresh();
//   if (!refreshToken) throw new Error("No refresh token available");

//   // Use the unsecure instance so this call never triggers another refresh loop
//   const { data } = await unsecureHttpService.post<{
//     access: string;
//     refreshToken: string;
//   }>("/token/refresh", { refresh: refreshToken }); 
//   tokenStorage.setAccess(data.access);
//   // tokenStorage.setRefresh(data.refreshToken); // rotate refresh token
//   return data.access;
// }

// ─── Unsecured Instance Interceptors ─────────────────────────────────────────

unsecureHttpService.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError<unknown>): Promise<never> => Promise.reject(error)
);

// ─── Secured Instance — Request Interceptor ───────────────────────────────────

httpService.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGY2YWJjNTZhNTkyMTZjYTBkMzUwZjIiLCJ1c2VySWQiOiI2OGY2YWJjNDZhNTkyMTZjYTBkMzUwZjAiLCJyb2xlIjoiZXZlbnRfcGFydG5lciIsIm5hbWUiOiJWaWJleiBOYXRpb25zIiwiZXhwIjoxNzg1NTI0MjUyLjkxMywiaWF0IjoxNzg1NTEzNDUyfQ.JyxaZkfj7gOcxpYg6Fzq5DYbOJVSvP--e9Gffy6iu-s"
    // tokenStorage.getAccess();
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

    // Only attempt refresh on 401 and only once per request
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // ── If a refresh is already in-flight, queue this request ──────────────
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

    if (typeof window !== "undefined") {
      window.location.href = "/auth";
    }
    // ── This is the first 401 — kick off the refresh ────────────────────────
    originalRequest._retry = true;
    isRefreshing = true;

    // try {
    //   const newToken = await refreshAccessToken();
    //   processQueue(null, newToken);
    //   originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
    //   return httpService(originalRequest); // retry the original request
    // } catch (refreshError) {
    //   processQueue(refreshError, null);
    //   clearSession();

    //   // Redirect to login — works in both App Router and Pages Router
    //   if (typeof window !== "undefined") {
    //     window.location.href = "/auth";
    //   }
    //   return Promise.reject(refreshError);
    // } finally {
    //   isRefreshing = false;
    // }
  }
);

export default httpService;