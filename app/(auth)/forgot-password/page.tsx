"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/auth-shell";

type ForgotPasswordErrors = Partial<Record<"email", string>>;

const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: ForgotPasswordErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailRegExp.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setMessage("");
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setMessage("");

    window.setTimeout(() => {
      setIsSubmitting(false);
      setMessage("If an account exists for that email, we’ve sent reset instructions.");
    }, 600);
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email to receive a reset link."
      footer={
        <>
          Remembered it?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrors({});
              setMessage("");
            }}
            placeholder="you@company.com"
            className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-0"
            autoComplete="email"
          />
          {errors.email ? (
            <p className="text-xs text-[color:#d14343]">{errors.email}</p>
          ) : null}
        </div>
        {message ? (
          <p className="text-sm text-[color:var(--color-muted)]">{message}</p>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 flex h-12 items-center justify-center rounded-xl border border-border bg-foreground text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Send reset link"}
        </button>
      </form>
    </AuthShell>
  );
}

