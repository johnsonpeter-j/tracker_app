"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "react-toastify";

type Profile = {
  name: string;
  email: string;
  role: "Super Admin" | "Admin" | "Employee";
  department: string;
  title: string;
  phone: string;
  location: string;
  bio: string;
};

const CURRENT_PROFILE: Profile = {
  name: "Jordan Smith",
  email: "jordan.smith@tracker.io",
  role: "Admin",
  department: "Operations",
  title: "Head of Operations",
  phone: "+1 555-421-8890",
  location: "San Francisco, USA",
  bio: "Leads cross-functional teams to keep day-to-day operations running smoothly and efficiently.",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(CURRENT_PROFILE);
  const [isDirty, setIsDirty] = useState(false);

  const handleChange =
    (field: keyof Profile) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setProfile((current) => ({ ...current, [field]: value }));
      setIsDirty(true);
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isDirty) {
      toast.info("No changes to save.");
      return;
    }

    toast.success("Profile updated successfully.");
    setIsDirty(false);
  };

  const initials = useMemo(() => {
    const segments = profile.name.split(" ").filter(Boolean);
    if (segments.length === 0) {
      return "?";
    }
    if (segments.length === 1) {
      return segments[0]!.slice(0, 2).toUpperCase();
    }
    return `${segments[0]![0] ?? ""}${segments[segments.length - 1]![0] ?? ""}`.toUpperCase();
  }, [profile.name]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Profile</h2>
        <p className="text-sm text-[color:var(--color-muted)]">
          Manage how your information appears to other teammates.
        </p>
      </section>
      <section className="flex flex-col gap-6 rounded-3xl border border-border bg-surface/70 p-6 shadow-sm">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-background text-lg font-semibold uppercase tracking-wide text-foreground">
            {initials}
          </span>
          <div className="space-y-1">
            <p className="text-lg font-semibold text-foreground">{profile.name}</p>
            <p className="text-sm text-[color:var(--color-muted)]">{profile.title}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="profile-name" className="text-sm font-medium text-foreground">
                Full name
              </label>
              <input
                id="profile-name"
                type="text"
                value={profile.name}
                onChange={handleChange("name")}
                className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-0"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="profile-title" className="text-sm font-medium text-foreground">
                Title
              </label>
              <input
                id="profile-title"
                type="text"
                value={profile.title}
                onChange={handleChange("title")}
                className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-0"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="profile-phone" className="text-sm font-medium text-foreground">
                Phone
              </label>
              <input
                id="profile-phone"
                type="tel"
                value={profile.phone}
                onChange={handleChange("phone")}
                className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-0"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="profile-location" className="text-sm font-medium text-foreground">
                Location
              </label>
              <input
                id="profile-location"
                type="text"
                value={profile.location}
                onChange={handleChange("location")}
                className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-0"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="profile-email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                value={profile.email}
                disabled
                className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground outline-none opacity-70 transition focus:border-foreground focus:ring-0"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="profile-department" className="text-sm font-medium text-foreground">
                Department
              </label>
              <input
                id="profile-department"
                type="text"
                value={profile.department}
                disabled
                className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground outline-none opacity-70 transition focus:border-foreground focus:ring-0"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="profile-role" className="text-sm font-medium text-foreground">
                Role
              </label>
              <input
                id="profile-role"
                type="text"
                value={profile.role}
                disabled
                className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground outline-none opacity-70 transition focus:border-foreground focus:ring-0"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="profile-bio" className="text-sm font-medium text-foreground">
              Bio
            </label>
            <textarea
              id="profile-bio"
              value={profile.bio}
              onChange={handleChange("bio")}
              rows={4}
              className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-0"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!isDirty}
            >
              Save changes
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

