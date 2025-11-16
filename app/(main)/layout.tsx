"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { AppBar } from "@/components/layout/app-bar";
import { useAuth } from "@/components/providers/auth-provider";
import { verifyToken } from "@/api/auth.api";
import { getStoredToken, type ApiError } from "@/api/http";
import { toast } from "react-toastify";

export default function MainLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { clearAuth, setAuth } = useAuth();

  useEffect(() => {
    let alive = true;

    const run = async () => {
      const token = getStoredToken();
      if (!token) {
        clearAuth();
        return;
      }

      try {
        const response = await verifyToken({ token });
        if (!alive) return;
        if (!response.valid) {
          clearAuth();
          return;
        }

        if (response.user) {
          setAuth({ token: response.token ?? token, user: response.user });
        }
      } catch (error: unknown) {
        if (!alive) return;
        const apiError = error as ApiError;
        toast.error(apiError.message ?? "Session expired. Please sign in again.");
        clearAuth();
      }
    };

    run();

    return () => {
      alive = false;
    };
  }, [clearAuth, setAuth]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppBar onToggleSidebar={() => setIsSidebarOpen((value) => !value)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
      {isSidebarOpen ? (
        <button
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 block cursor-default bg-black/40 backdrop-blur-sm md:hidden"
          aria-label="Close sidebar"
        />
      ) : null}
    </div>
  );
}

