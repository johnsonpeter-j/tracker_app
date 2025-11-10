"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { AppBar } from "@/components/layout/app-bar";

export default function MainLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

