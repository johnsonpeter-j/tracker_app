"use client";

import { useState, type FormEvent } from "react";
import { toast } from "react-toastify";

const MIN_PASSWORD_LENGTH = 8;

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};

    if (!oldPassword.trim()) {
      nextErrors.oldPassword = "Enter your current password.";
    }

    if (!newPassword.trim()) {
      nextErrors.newPassword = "Enter a new password.";
    } else if (newPassword.length < MIN_PASSWORD_LENGTH) {
      nextErrors.newPassword = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }

    if (!confirmPassword.trim()) {
      nextErrors.confirmPassword = "Confirm your new password.";
    } else if (newPassword !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate request
    window.setTimeout(() => {
      setIsSubmitting(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully.");
    }, 800);
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8">
        <section className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Change password
          </h2>
          <p className="text-sm text-[color:var(--color-muted)]">
            Choose a strong password to keep your account secure.
          </p>
        </section>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-3xl border border-border bg-surface/70 p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <label htmlFor="old-password" className="text-sm font-medium text-foreground">
              Current password
            </label>
            <input
              id="old-password"
              type="password"
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
              className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-0"
              autoComplete="current-password"
            />
            {errors.oldPassword ? (
              <p className="text-xs text-[color:#d14343]">{errors.oldPassword}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="new-password" className="text-sm font-medium text-foreground">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-0"
              autoComplete="new-password"
            />
            {errors.newPassword ? (
              <p className="text-xs text-[color:#d14343]">{errors.newPassword}</p>
            ) : (
              <p className="text-xs text-[color:var(--color-muted)]">
                Use at least {MIN_PASSWORD_LENGTH} characters, including a mix of letters and numbers.
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
              Confirm new password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-0"
              autoComplete="new-password"
            />
            {errors.confirmPassword ? (
              <p className="text-xs text-[color:#d14343]">{errors.confirmPassword}</p>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-foreground px-4 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}

