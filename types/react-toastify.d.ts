declare module "react-toastify" {
  import type { ComponentType, ReactNode } from "react";

  export interface ToastContainerProps {
    position?:
      | "top-left"
      | "top-right"
      | "top-center"
      | "bottom-left"
      | "bottom-right"
      | "bottom-center";
    theme?: string;
    newestOnTop?: boolean;
  }

  export const ToastContainer: ComponentType<ToastContainerProps>;

  export interface ToastOptions {
    type?: "info" | "success" | "warning" | "error" | "default";
  }

  export type ToastContent = ReactNode | string;

  export interface ToastFn {
    (content: ToastContent, options?: ToastOptions): void;
    success(content: ToastContent, options?: ToastOptions): void;
    error(content: ToastContent, options?: ToastOptions): void;
    info(content: ToastContent, options?: ToastOptions): void;
    warn(content: ToastContent, options?: ToastOptions): void;
  }

  export const toast: ToastFn;
}

