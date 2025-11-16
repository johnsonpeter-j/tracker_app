"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ChevronDownIcon, PlusIcon } from "@/components/shared/icons";
import { toast } from "react-toastify";
import { SelectOptionType } from "@/types/common.types";
import { getDepartments } from "@/api/department.api";

type Role = "Super Admin" | "Admin" | "Employee";

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  joinedAt: string;
  avatarInitials: string;
};

type UserDialogMode = "create" | "edit" | "view" | "confirm-delete";

const INITIAL_USERS: User[] = [
  {
    id: "USR-101",
    name: "Jordan Smith",
    email: "jordan.smith@tracker.io",
    role: "Admin",
    department: "Operations",
    joinedAt: "May 12, 2024",
    avatarInitials: "JS",
  },
  {
    id: "USR-087",
    name: "Amelia Chen",
    email: "amelia.chen@tracker.io",
    role: "Employee",
    department: "Finance",
    joinedAt: "Jan 9, 2024",
    avatarInitials: "AC",
  },
  {
    id: "USR-074",
    name: "Sebastian Lee",
    email: "sebastian.lee@tracker.io",
    role: "Employee",
    department: "People",
    joinedAt: "Jul 22, 2023",
    avatarInitials: "SL",
  },
  {
    id: "USR-063",
    name: "Priya Patel",
    email: "priya.patel@tracker.io",
    role: "Employee",
    department: "Product",
    joinedAt: "Nov 4, 2023",
    avatarInitials: "PP",
  },
  {
    id: "USR-052",
    name: "Leo Martín",
    email: "leo.martin@tracker.io",
    role: "Employee",
    department: "Design",
    joinedAt: "Mar 18, 2024",
    avatarInitials: "LM",
  },
  {
    id: "USR-041",
    name: "Sofia Alvarez",
    email: "sofia.alvarez@tracker.io",
    role: "Admin",
    department: "Security",
    joinedAt: "Sep 1, 2023",
    avatarInitials: "SA",
  },
];



const ROLES: Role[] = ["Admin", "Employee"];


const formatDate = (value: Date) =>
  value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const getInitials = (name: string) => {
  const segments = name.trim().split(" ").filter(Boolean);

  if (segments.length === 0) {
    return "?";
  }

  if (segments.length === 1) {
    return segments[0]!.slice(0, 2).toUpperCase();
  }

  return `${segments[0]![0] ?? ""}${segments[segments.length - 1]![0] ?? ""}`.toUpperCase();
};

const EMPTY_USER = {
  id: "",
  name: "",
  email: "",
  department: "",
  role: "Employee" as Role,
  joinedAt: "",
  avatarInitials: "",
};

export default function UsersPage() {
  const [users, setUsers] = useState(INITIAL_USERS);

  const [departmentList, setDepartmentList] = useState<SelectOptionType[]>([]);

  useEffect(() => {
    let alive = true;

    const loadDepartments = async () => {
      try {
        const data = await getDepartments();
        if (alive) {
          const deptList = data?.map(deptItem=>{
            return {
              key: deptItem.id,
              value: deptItem.name
            }
          })
          setDepartmentList(deptList);
        }
      } catch (error) {
        console.error(error);
        toast.error("Couldn’t load departments, please try again.");
      }
    };

    loadDepartments();

    return () => {
      alive = false;
    };
  }, []);

  const [departmentFilter, setDepartmentFilter] = useState<string>(departmentList[0]?.key ?? "all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<UserDialogMode>("create");
  const [formValues, setFormValues] = useState(EMPTY_USER);
  const [targetUser, setTargetUser] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    if (departmentFilter === "all") {
      return users;
    }

    const selectedDepartment = departmentList.find((department) => department.key === departmentFilter);

    if (!selectedDepartment) {
      return users;
    }

    return users.filter((user) => user.department === selectedDepartment.value);
  }, [departmentFilter, users]);

  const resetForm = () => {
    setFormValues(EMPTY_USER);
    setTargetUser(null);
  };

  const openDialog = (mode: UserDialogMode, user?: User) => {
    setDialogMode(mode);

    if (mode === "confirm-delete") {
      setTargetUser(user ?? null);
      setIsDialogOpen(true);
      return;
    }

    if (user) {
      setFormValues({
        id: user.id,
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role,
        joinedAt: user.joinedAt,
        avatarInitials: user.avatarInitials,
      });
    } else {
      resetForm();
    }

    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (dialogMode === "view") {
      handleDialogClose();
      return;
    }

    const trimmedName = formValues.name.trim();
    const trimmedEmail = formValues.email.trim();

    if (!trimmedName || !trimmedEmail) {
      toast.error("Name and email are required.");
      return;
    }

    if (dialogMode === "edit" && formValues.id) {
      setUsers((current) =>
        current.map((user) =>
          user.id === formValues.id
            ? {
                ...user,
                name: trimmedName,
                email: trimmedEmail,
                department: formValues.department,
                role: formValues.role,
                avatarInitials: getInitials(trimmedName),
              }
            : user,
        ),
      );
      toast.success("User updated.");
    } else {
      const now = new Date();
      const nextUser: User = {
        id: `USR-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
        name: trimmedName,
        email: trimmedEmail,
        department: formValues.department,
        role: formValues.role,
        joinedAt: formatDate(now),
        avatarInitials: getInitials(trimmedName),
      };

      setUsers((current) => [nextUser, ...current]);
      toast.success("User created.");
    }

    handleDialogClose();
  };

  const handleRoleToggle = (user: User) => {
    if (user.role === "Super Admin") {
      toast.info("Super Admin role cannot be changed.");
      return;
    }

    const nextRole: Role = user.role === "Employee" ? "Admin" : "Employee";

    setUsers((current) =>
      current.map((existing) =>
        existing.id === user.id ? { ...existing, role: nextRole } : existing,
      ),
    );

    toast.success(
      `${user.name} is now ${nextRole === "Admin" ? "an Admin" : "an Employee"}.`,
    );
  };

  const handleDelete = (user: User) => {
    openDialog("confirm-delete", user);
  };

  const isReadOnly = dialogMode === "view";

  const handleConfirmDelete = () => {
    if (!targetUser) {
      handleDialogClose();
      return;
    }

    setUsers((current) => current.filter((user) => user.id !== targetUser.id));
    toast.success(`${targetUser.name} deleted.`);
    handleDialogClose();
  };

  return (
    <>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Team members</h2>
          <p className="text-sm text-[color:var(--color-muted)]">
            Overview of everyone working across departments. Need to promote someone? Start here.
          </p>
        </section>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full min-w-[180px] sm:w-48">
            <label className="sr-only" htmlFor="department-filter">
              Filter by department
            </label>
            <select
              id="department-filter"
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
              className="w-full appearance-none rounded-xl border border-border bg-input px-4 py-3 pr-12 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-0"
            >
              {[{key: "all", value: "All departments"}, ...departmentList].map((department) => (
                <option key={department.key} value={department.key}>
                  {department.value === "All" ? "All departments" : department.value}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-muted)]" />
          </div>
        </div>
        <section className="grid gap-4">
          {filteredUsers.map((user) => (
            <article
              key={user.id}
              className="flex flex-col gap-4 rounded-3xl border border-border bg-surface/70 p-5 shadow-sm transition hover:border-foreground/40 hover:shadow-lg"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background text-base font-semibold uppercase tracking-wide text-foreground">
                    {user.avatarInitials}
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{user.name}</p>
                    <p className="text-sm text-[color:var(--color-muted)]">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs sm:justify-end">
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-[color:var(--color-muted)]">
                    {user.department}
                  </span>
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-[color:var(--color-muted)]">
                    {user.role}
                  </span>
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-[color:var(--color-muted)]">
                    Joined {user.joinedAt}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:justify-end">
                <button
                  type="button"
                  className="rounded-full border border-border bg-background px-3 py-2 font-medium text-foreground transition hover:border-foreground"
                  onClick={() => openDialog("view", user)}
                >
                  View
                </button>
                <button
                  type="button"
                  className="rounded-full border border-border bg-background px-3 py-2 font-medium text-foreground transition hover:border-foreground"
                  onClick={() => openDialog("edit", user)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="rounded-full border border-border bg-background px-3 py-2 font-medium text-foreground transition hover:border-foreground"
                  onClick={() => handleRoleToggle(user)}
                  disabled={user.role === "Super Admin"}
                >
                  {user.role === "Admin" || user.role === "Super Admin"
                    ? "Make employee"
                    : "Make admin"}
                </button>
                <button
                  type="button"
                  className="rounded-full border border-border bg-background px-3 py-2 font-medium text-[color:#d14343] transition hover:border-[color:#d14343]"
                  onClick={() => handleDelete(user)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
      <button
        type="button"
        onClick={() => openDialog("create")}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-foreground text-background shadow-lg transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
        aria-label="Add user"
      >
        <PlusIcon className="h-6 w-6" />
      </button>
      {isDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-border bg-background p-6 text-left shadow-xl">
            {dialogMode === "confirm-delete" ? (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-foreground">Delete user?</h3>
                  <p className="text-sm text-[color:var(--color-muted)]">
                    Are you sure you want to remove {targetUser?.name}? This action cannot be undone.
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleDialogClose}
                    className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:border-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="inline-flex items-center justify-center rounded-xl border border-border bg-[color:#d14343] px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 space-y-1 text-left">
                  <h3 className="text-lg font-semibold text-foreground">
                    {dialogMode === "create"
                      ? "Add new user"
                      : dialogMode === "edit"
                        ? "Edit user"
                        : "User details"}
                  </h3>
                  <p className="text-sm text-[color:var(--color-muted)]">
                    {dialogMode === "view"
                      ? "User information is read-only."
                      : "Provide user information and assign them to a department."}
                  </p>
                </div>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="user-name" className="text-sm font-medium text-foreground">
                      Full name
                    </label>
                    <input
                      id="user-name"
                      type="text"
                      value={formValues.name}
                      onChange={(event) =>
                        setFormValues((current) => ({ ...current, name: event.target.value }))
                      }
                      placeholder="Jordan Smith"
                      className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-0"
                      required
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="user-email" className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <input
                      id="user-email"
                      type="email"
                      value={formValues.email}
                      onChange={(event) =>
                        setFormValues((current) => ({ ...current, email: event.target.value }))
                      }
                      placeholder="jordan.smith@tracker.io"
                      className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-0"
                      required
                      disabled={dialogMode !== "create"}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="user-department" className="text-sm font-medium text-foreground">
                      Department
                    </label>
                    <select
                      id="user-department"
                      value={formValues.department}
                      onChange={(event) =>
                        setFormValues((current) => ({ ...current, department: event.target.value }))
                      }
                      className="w-full appearance-none rounded-xl border border-border bg-input px-4 py-3 pr-12 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-0"
                      disabled={isReadOnly}
                    >
                      {departmentList.filter((department) => department.key !== "all").map((department) => (
                        <option key={department.key} value={department.value}>
                          {department.value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="user-role" className="text-sm font-medium text-foreground">
                      Role
                    </label>
                    <select
                      id="user-role"
                      value={formValues.role}
                      onChange={(event) =>
                        setFormValues((current) => ({
                          ...current,
                          role: event.target.value as Role,
                        }))
                      }
                      className="w-full appearance-none rounded-xl border border-border bg-input px-4 py-3 pr-12 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-0"
                      disabled={isReadOnly || formValues.role === "Super Admin"}
                    >
                      {(dialogMode === "create"
                        ? ROLES
                        : ROLES.filter((role) => role !== "Super Admin")).map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                    </select>
                  </div>
                  {formValues.joinedAt ? (
                    <p className="text-xs text-[color:var(--color-muted)]">
                      Joined {formValues.joinedAt}
                    </p>
                  ) : null}
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleDialogClose}
                      className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:border-foreground"
                    >
                      {dialogMode === "view" ? "Close" : "Cancel"}
                    </button>
                    {dialogMode !== "view" ? (
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-xl border border-border bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
                      >
                        {dialogMode === "edit" ? "Update" : "Save user"}
                      </button>
                    ) : null}
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

