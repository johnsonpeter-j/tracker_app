"use client";

import { useTheme } from "@/components/theme/theme-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type ThemeOption = "light" | "dark" | "system";

type DeleteDialog = "closed" | "confirm";

export default function SettingsPage() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialog>("closed");

  const themeOptions: ThemeOption[] = ["light", "dark", "system"];

  const handleThemeChange = (nextTheme: ThemeOption) => {
    if (nextTheme === theme) {
      return;
    }
    setTheme(nextTheme);
    toast.success(`Switched to ${nextTheme} mode.`);
  };

  const handleDeleteAccount = () => {
    setIsDeleting(true);

    window.setTimeout(() => {
      setIsDeleting(false);
      setDeleteDialog("closed");
      toast.success("Account deleted.");
      router.push("/sign-in");
    }, 1000);
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h2>
        <p className="text-sm text-[color:var(--color-muted)]">
          Customize your experience and manage your account preferences.
        </p>
      </section>

      <section className="flex flex-col gap-6 rounded-3xl border border-border bg-surface/70 p-6 shadow-sm">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
          <p className="text-sm text-[color:var(--color-muted)]">
            Choose the appearance theme that fits your environment.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {themeOptions.map((option) => {
              const isActive = theme === option;
              const label =
                option === "light"
                  ? "Light mode"
                  : option === "dark"
                    ? "Dark mode"
                    : `System (${resolvedTheme} mode)`;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleThemeChange(option)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border border-border bg-foreground text-background"
                      : "border border-border bg-background text-foreground hover:border-foreground"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-3xl border border-[color:#d14343] bg-[color:#2b0e0e] p-6 shadow-sm">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[color:#f87171]">Danger zone</h3>
          <p className="text-sm text-[color:#fca5a5]">
            Deleting your account removes your data permanently. This action cannot be undone.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDeleteDialog("confirm")}
          className="inline-flex items-center justify-center rounded-xl border border-[color:#f87171] bg-[color:#dc2626] px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Delete account
        </button>
      </section>

      {deleteDialog === "confirm" ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-border bg-background p-6 text-left shadow-xl">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Delete account?</h3>
              <p className="text-sm text-[color:var(--color-muted)]">
                This action logs you out and permanently removes your account. Are you sure you want to proceed?
              </p>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteDialog("closed")}
                className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:border-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="inline-flex items-center justify-center rounded-xl border border-[color:#f87171] bg-[color:#dc2626] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Processing..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

