"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/auth-shell";

type SignInErrors = Partial<Record<"email" | "password", string>>;

const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInPage() {
  const router = useRouter();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<SignInErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange =
    (field: "email" | "password") =>
    (event: ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: SignInErrors = {};

    if (!values.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailRegExp.test(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!values.password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (values.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      router.push("/home");
    }, 600);
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your team tasks."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Create one
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
            value={values.email}
            onChange={handleChange("email")}
            placeholder="you@company.com"
            className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-0"
            autoComplete="email"
          />
          {errors.email ? (
            <p className="text-xs text-[color:#d14343]">{errors.email}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={values.password}
            onChange={handleChange("password")}
            placeholder="Enter your password"
            className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-0"
            autoComplete="current-password"
          />
          {errors.password ? (
            <p className="text-xs text-[color:#d14343]">{errors.password}</p>
          ) : null}
        </div>
        <div className="flex items-center justify-between">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 flex h-12 items-center justify-center rounded-xl border border-border bg-foreground text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}

