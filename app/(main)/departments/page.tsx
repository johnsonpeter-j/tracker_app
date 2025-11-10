"use client";

import { useMemo, useState, type FormEvent } from "react";
import { PlusIcon } from "@/components/shared/icons";
import { toast } from "react-toastify";

type Department = {
  id: string;
  name: string;
  description: string;
  members: number;
};

const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: "DEP-01",
    name: "Operations",
    description: "Keeps day-to-day business running smoothly across the org.",
    members: 18,
  },
  {
    id: "DEP-02",
    name: "Finance",
    description: "Budget planning, payroll, and long-term financial forecasting.",
    members: 12,
  },
  {
    id: "DEP-03",
    name: "People",
    description: "Hiring, onboarding, and supporting our people initiatives.",
    members: 0,
  },
  {
    id: "DEP-04",
    name: "Product",
    description: "Owns the roadmap and partners with engineering to ship value.",
    members: 22,
  },
  {
    id: "DEP-05",
    name: "Design",
    description: "Crafts user experiences, prototypes, and brand guidelines.",
    members: 9,
  },
  {
    id: "DEP-06",
    name: "Security",
    description: "Protects our infrastructure, data, and compliance posture.",
    members: 14,
  },
];

type DepartmentDialogMode = "create" | "edit" | "view" | "confirm-delete";

const EMPTY_DEPARTMENT = {
  id: "",
  name: "",
  description: "",
  members: 0,
};

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DepartmentDialogMode>("create");
  const [formValues, setFormValues] = useState(EMPTY_DEPARTMENT);
  const [targetDepartment, setTargetDepartment] = useState<Department | null>(null);

  const filteredDepartments = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return departments;
    }

    return departments.filter((department) =>
      department.name.toLowerCase().includes(query),
    );
  }, [departments, searchTerm]);

  const resetForm = () => {
    setFormValues(EMPTY_DEPARTMENT);
    setTargetDepartment(null);
  };

  const openDialog = (mode: DepartmentDialogMode, department?: Department) => {
    setDialogMode(mode);

    if (mode === "confirm-delete") {
      setTargetDepartment(department ?? null);
      setIsDialogOpen(true);
      return;
    }

    if (department) {
      setFormValues({
        id: department.id,
        name: department.name,
        description: department.description,
        members: department.members,
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

    if (dialogMode === "confirm-delete") {
      if (!targetDepartment) {
        handleDialogClose();
        return;
      }

      setDepartments((current) =>
        current.filter((department) => department.id !== targetDepartment.id),
      );
      toast.success(`${targetDepartment.name} deleted.`);
      handleDialogClose();
      return;
    }

    const trimmedName = formValues.name.trim();

    if (!trimmedName) {
      return;
    }

    if (dialogMode === "edit" && formValues.id) {
      setDepartments((current) =>
        current.map((department) =>
          department.id === formValues.id
            ? {
                ...department,
                name: trimmedName,
                description: formValues.description.trim() || "",
              }
            : department,
        ),
      );
    } else {
      const nextDepartment: Department = {
        id:
          dialogMode === "edit" && formValues.id
            ? formValues.id
            : `DEP-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
        name: trimmedName,
        description: formValues.description.trim() || "",
        members: dialogMode === "edit" ? formValues.members : 0,
      };

      setDepartments((current) => [nextDepartment, ...current]);
    }

    handleDialogClose();
  };

  const isReadOnly = dialogMode === "view";

  const handleDelete = (department: Department) => {
    if (department.members > 0) {
      toast.error(
        `${department.name} still has ${department.members} member${
          department.members > 1 ? "s" : ""
        }. Remove them before deleting.`,
      );
      return;
    }

    openDialog("confirm-delete", department);
  };

  return (
    <>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="space-y-2">
          <h2 className="text-2xl dit font-semibold tracking-tight text-foreground">
            Departments
          </h2>
          <p className="text-sm text-[color:var(--color-muted)]">
            Manage teams, department heads, and headcount at a glance.
          </p>
        </section>
        <div className="relative w-full sm:max-w-sm">
          <label className="sr-only" htmlFor="department-search">
            Search department
          </label>
          <input
            id="department-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by department name"
            className="w-full rounded-xl border border-border bg-input px-4 py-3 pl-11 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-0"
          />
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-muted)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3-3" />
          </svg>
        </div>
        <section className="grid gap-4">
          {filteredDepartments.map((department) => (
            <article
              key={department.id}
              className="flex flex-col gap-3 rounded-3xl border border-border bg-surface/70 p-5 shadow-sm transition hover:border-foreground/40 hover:shadow-lg"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">{department.name}</h3>
                    <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-[color:var(--color-muted)]">
                      {department.members} members
                    </span>
                  </div>
                  <p className="text-sm text-[color:var(--color-muted)]">
                    {department.description || "No description provided yet."}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[color:var(--color-muted)] sm:justify-end">
                  <button
                    type="button"
                    className="rounded-full border border-border bg-background px-3 py-2 font-medium text-foreground transition hover:border-foreground"
                    onClick={() => openDialog("view", department)}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-border bg-background px-3 py-2 font-medium text-foreground transition hover:border-foreground"
                    onClick={() => openDialog("edit", department)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-border bg-background px-3 py-2 font-medium text-[color:#d14343] transition hover:border-[color:#d14343]"
                    onClick={() => handleDelete(department)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
      <button
        type="button"
        onClick={() => openDialog("create")}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-foreground text-background shadow-lg transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
        aria-label="Add department"
      >
        <PlusIcon className="h-6 w-6" />
      </button>
      {isDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-border bg-background p-6 text-left shadow-xl">
            {dialogMode === "confirm-delete" ? (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-foreground">Delete department?</h3>
                  <p className="text-sm text-[color:var(--color-muted)]">
                    {`Are you sure you want to remove ${targetDepartment?.name}? This action cannot be undone.`}
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
                    onClick={handleSubmit as unknown as () => void}
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
                      ? "Add new department"
                      : dialogMode === "edit"
                        ? "Edit department"
                        : "Department details"}
                  </h3>
                  <p className="text-sm text-[color:var(--color-muted)]">
                    {dialogMode === "view"
                      ? "Department information is read-only."
                      : "Capture the basics and fill in details later."}
                  </p>
                </div>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="department-name" className="text-sm font-medium text-foreground">
                      Department name
                    </label>
                    <input
                      id="department-name"
                      type="text"
                      value={formValues.name}
                      onChange={(event) =>
                        setFormValues((current) => ({ ...current, name: event.target.value }))
                      }
                      placeholder="Customer Success"
                      className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-0"
                      required
                      disabled={isReadOnly}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="department-description" className="text-sm font-medium text-foreground">
                      Description
                    </label>
                    <textarea
                      id="department-description"
                      value={formValues.description}
                      onChange={(event) =>
                        setFormValues((current) => ({ ...current, description: event.target.value }))
                      }
                      placeholder="What is this department responsible for?"
                      className="h-24 w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-0"
                      disabled={isReadOnly}
                    />
                  </div>
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
                        {dialogMode === "edit" ? "Update" : "Save department"}
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

