"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { mainNavItems } from "@/components/layout/main-nav-items";
import { LogoutIcon } from "@/components/shared/icons";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const activeHref = useMemo(() => pathname, [pathname]);
  const router = useRouter();

  const handleLogout = () => {
    router.push("/sign-in");
    onClose?.();
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-surface/95 px-0 py-0 shadow-xl transition-transform duration-200 ease-in-out backdrop-blur-sm md:static md:inset-auto md:block md:translate-x-0 md:border-r md:bg-surface/80 md:shadow-none ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-hidden={!isOpen && typeof window !== "undefined" && window.innerWidth < 768}
    >
      <div className="flex h-full flex-col gap-8 px-6 py-10">
        <div className="space-y-1">
          <p className="text-lg font-semibold text-foreground">Task Tracker</p>
          <p className="text-sm text-[color:var(--color-muted)]">
            Manage work across teams.
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-2 text-sm font-medium">
          {mainNavItems.map((item) => {
            const isActive = activeHref === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`rounded-xl px-4 py-2 transition ${
                  isActive
                    ? "border border-border bg-[color:var(--color-sidebar-active-bg)] text-[color:var(--color-sidebar-active-text)]"
                    : "border border-transparent text-foreground/80 hover:border-border hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:border-foreground"
          >
            <LogoutIcon className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}