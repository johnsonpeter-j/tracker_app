"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { AuthShell } from "@/components/auth/auth-shell";

type Field = "name" | "email" | "password" | "confirmPassword";

type SignUpErrors = Partial<Record<Field, string>>;

const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpPage() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange =
    (field: Field) =>
    (event: ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: SignUpErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = "Name is required.";
    }

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

    if (!values.confirmPassword.trim()) {
      nextErrors.confirmPassword = "Confirm your password.";
    } else if (values.confirmPassword !== values.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start tracking tasks for your team."
      footer={
        <>
          Already have an account?{" "}
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
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Full name
          </label>
          <input
            id="name"
            type="text"
            value={values.name}
            onChange={handleChange("name")}
            placeholder="Jordan Smith"
            className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-0"
            autoComplete="name"
          />
          {errors.name ? (
            <p className="text-xs text-[color:#d14343]">{errors.name}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Work email
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
            placeholder="Create a password"
            className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-0"
            autoComplete="new-password"
          />
          {errors.password ? (
            <p className="text-xs text-[color:#d14343]">{errors.password}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-foreground"
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange("confirmPassword")}
            placeholder="Repeat your password"
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
          className="mt-2 flex h-12 items-center justify-center rounded-xl border border-border bg-foreground text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating account..." : "Sign up"}
        </button>
      </form>
    </AuthShell>
  );
}

