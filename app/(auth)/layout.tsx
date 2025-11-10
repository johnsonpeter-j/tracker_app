import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </>
  );
}

