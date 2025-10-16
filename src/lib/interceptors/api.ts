import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

console.log("backend url",process.env.NEXT_PUBLIC_BACKEND_URL);
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL ,
  withCredentials: true, // send cookies automatically
});
console.log("backend url",process.env.NEXT_PUBLIC_BACKEND_URL);

export const publicApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true, // send cookies automatically
});


let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];

function subscribeTokenRefresh(cb: () => void): void {
  refreshSubscribers.push(cb);
}

function onRefreshed(): void {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
}


api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Wait for token refresh to finish
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => resolve(api(originalRequest)));
        });
      }

      isRefreshing = true;

      try {
        
        await api.post("/auth/token");
        onRefreshed();
        return api(originalRequest);
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          window.location.href = "/login";
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
