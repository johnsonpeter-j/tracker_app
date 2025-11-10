"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <Link
        href="/sign-in"
        className="text-lg font-semibold tracking-tight text-foreground transition hover:opacity-80"
      >
        Task Tracker
      </Link>
      <ThemeToggle />
    </header>
  );
}

