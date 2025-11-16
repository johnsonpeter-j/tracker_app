declare module "axios" {
  export interface AxiosRequestConfig {
    baseURL?: string;
    timeout?: number;
    headers?: Record<string, string>;
  }

  export interface AxiosResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: AxiosRequestConfig;
  }

  export interface AxiosError<T = any> extends Error {
    config?: AxiosRequestConfig;
    response?: AxiosResponse<T>;
    code?: string;
  }

  export interface AxiosInstance {
    interceptors: {
      request: {
        use(onFulfilled: (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>, onRejected?: (error: any) => any): number;
        eject(id: number): void;
      };
    };
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  }

  export interface AxiosStatic {
    create(config?: AxiosRequestConfig): AxiosInstance;
    isAxiosError(payload: unknown): payload is AxiosError;
  }

  const axios: AxiosStatic;
  export default axios;
}

