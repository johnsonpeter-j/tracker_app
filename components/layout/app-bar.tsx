"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { MenuIcon } from "@/components/shared/icons";
import { mainNavItems } from "@/components/layout/main-nav-items";
import { useAuth } from "@/components/providers/auth-provider";

type AppBarProps = {
  onToggleSidebar?: () => void;
};

export function AppBar({ onToggleSidebar }: AppBarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const activeItem =
    mainNavItems.find((item) => item.href === pathname) ?? mainNavItems[0];
  const initials = getInitials(user?.name);

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface/80 px-4 py-3 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="flex flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:border-foreground md:hidden"
          aria-label="Toggle sidebar"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
            {activeItem?.label ?? "Task Tracker"}
          </span>
          <span className="text-xs text-[color:var(--color-muted)] sm:text-sm">
            Manage team work in one place.
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link
          href="/profile"
          className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-sm text-foreground/80 transition hover:border-foreground"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-sm font-medium text-foreground">
            {initials}
          </span>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-medium text-foreground">
              {user?.name ?? "Guest user"}
            </span>
            <span className="text-xs text-[color:var(--color-muted)]">
              {user?.role ?? "Visitor"}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}

function getInitials(name?: string) {
  if (!name) {
    return "??";
  }
  const segments = name.split(" ").filter(Boolean);
  if (segments.length === 0) {
    return "??";
  }
  if (segments.length === 1) {
    return segments[0]!.slice(0, 2).toUpperCase();
  }
  return `${segments[0]![0] ?? ""}${segments[segments.length - 1]![0] ?? ""}`
    .toUpperCase()
    .slice(0, 2);
}

