"use client";

import {
  useEffect,
  useMemo,
  useState,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  PlayIcon,
  PauseIcon,
  CheckIcon,
  PlusIcon,
  ChevronDownIcon,
} from "@/components/shared/icons";

type Task = {
  id: string;
  title: string;
  description: string;
  department: string;
  assignee: string;
  due: string;
  status: "In Progress" | "Upcoming" | "Blocked" | "Completed";
  priority: "High" | "Medium" | "Low";
  elapsedSeconds: number;
};

type MemberTasks = {
  name: string;
  department: string;
  tasks: Array<Pick<Task, "id" | "title" | "priority" | "status" | "elapsedSeconds">>;
};

const initialTasks: Task[] = [
  {
    id: "TT-1021",
    title: "Finalize Q4 project roadmap",
    description: "Collect input from department leads and publish the consolidated plan.",
    department: "Operations",
    assignee: "Jordan Smith",
    due: "Nov 14, 2025",
    status: "In Progress",
    priority: "High",
    elapsedSeconds: 5400,
  },
  {
    id: "TT-1016",
    title: "Prepare payroll audit checklist",
    description: "Verify compliance items and send the checklist to finance for review.",
    department: "Finance",
    assignee: "Amelia Chen",
    due: "Nov 12, 2025",
    status: "Upcoming",
    priority: "Medium",
    elapsedSeconds: 0,
  },
  {
    id: "TT-0998",
    title: "Deploy onboarding checklist update",
    description: "Include hardware security training in the first-week onboarding flow.",
    department: "People",
    assignee: "Sebastian Lee",
    due: "Nov 10, 2025",
    status: "Blocked",
    priority: "High",
    elapsedSeconds: 2100,
  },
  {
    id: "TT-0992",
    title: "Publish sprint retro summary",
    description: "Compile action items and share the recording with product stakeholders.",
    department: "Product",
    assignee: "Priya Patel",
    due: "Nov 8, 2025",
    status: "Completed",
    priority: "Low",
    elapsedSeconds: 3600,
  },
  {
    id: "TT-0985",
    title: "Refresh asset library structure",
    description: "Reorganize shared drive folders and document the new taxonomy.",
    department: "Design",
    assignee: "Leo Martín",
    due: "Nov 16, 2025",
    status: "Upcoming",
    priority: "Medium",
    elapsedSeconds: 0,
  },
  {
    id: "TT-0973",
    title: "Roll out MFA to contractors",
    description: "Coordinate IT support and confirm adoption metrics after launch.",
    department: "Security",
    assignee: "Sofia Alvarez",
    due: "Nov 18, 2025",
    status: "In Progress",
    priority: "High",
    elapsedSeconds: 5520,
  },
  {
    id: "TT-0968",
    title: "Close FY25 performance reviews",
    description: "Compile feedback packets and finalize promotion recommendations.",
    department: "People",
    assignee: "Jordan Smith",
    due: "Nov 5, 2025",
    status: "Completed",
    priority: "High",
    elapsedSeconds: 7200,
  },
  {
    id: "TT-0954",
    title: "Audit vendor security agreements",
    description: "Review existing contracts to ensure security clauses are up to date.",
    department: "Security",
    assignee: "Sofia Alvarez",
    due: "Oct 30, 2025",
    status: "Completed",
    priority: "Medium",
    elapsedSeconds: 8100,
  },
];

const statusStyles: Record<Task["status"], string> = {
  "In Progress":
    "border border-border bg-[color:var(--color-foreground)] text-[color:var(--color-background)]",
  Upcoming:
    "border border-border bg-[color:var(--color-background)] text-foreground",
  Blocked:
    "border border-border border-dashed bg-[color:var(--color-background)] text-foreground",
  Completed:
    "border border-border bg-[color:var(--color-surface)] text-[color:var(--color-muted)]",
};

const priorityStyles: Record<Task["priority"], string> = {
  High: "border border-border bg-[color:var(--color-background)] text-foreground font-semibold",
  Medium: "border border-border bg-[color:var(--color-background)] text-foreground/80",
  Low: "border border-border bg-[color:var(--color-background)] text-[color:var(--color-muted)]",
};

const formatElapsed = (totalSeconds: number) => {
  if (totalSeconds <= 0) {
    return "0m";
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }

  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }

  if (hours === 0 && seconds > 0) {
    parts.push(`${seconds}s`);
  }

  return parts.join(" ") || "0m";
};

function TaskActions({ task }: { task: MemberTasks["tasks"][number] }) {
  const [isRunning, setIsRunning] = useState(task.status === "In Progress");
  const [elapsed, setElapsed] = useState(task.elapsedSeconds);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleClick = (event: MouseEvent | TouchEvent) => {
      if (!menuRef.current) {
        return;
      }

      if (!menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setElapsed((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning]);

  return (
    <div className="flex flex-1 items-center justify-between gap-4 text-xs">
      <span className="whitespace-nowrap text-[color:var(--color-muted)]">
        {isRunning ? "Running" : "Paused"} • {formatElapsed(elapsed)}
      </span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsRunning((value) => !value)}
          className={`flex h-9 w-9 items-center justify-center rounded-full border border-border transition ${
            isRunning
              ? "bg-background text-foreground hover:border-foreground"
              : "bg-foreground text-background hover:opacity-90"
          }`}
          aria-label={isRunning ? "Pause task" : "Start task"}
        >
          {isRunning ? (
            <PauseIcon className="h-4 w-4" />
          ) : (
            <PlayIcon className="h-4 w-4" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setIsRunning(false)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:border-foreground disabled:opacity-50"
          disabled={!isRunning}
          aria-label="Complete task"
        >
          <CheckIcon className="h-4 w-4" />
        </button>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:border-foreground"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            aria-label="Task options"
          >
            ⋮
          </button>
          {isMenuOpen ? (
            <div className="absolute right-0 top-10 z-10 w-32 rounded-xl border border-border bg-background p-1 text-foreground shadow-lg">
              <button
                type="button"
                className="w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-surface"
                onClick={() => {
                  setIsMenuOpen(false);
                  window.alert("Edit task action goes here.");
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-[color:#d14343] transition hover:bg-surface"
                onClick={() => {
                  setIsMenuOpen(false);
                  window.alert("Delete task action goes here.");
                }}
              >
                Delete
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const useInitials = (name: string) =>
  useMemo(() => {
    const segments = name.trim().split(" ").filter(Boolean);

    if (segments.length === 0) {
      return "?";
    }

    if (segments.length === 1) {
      return segments[0]!.slice(0, 2).toUpperCase();
    }

    return `${segments[0]![0] ?? ""}${segments[segments.length - 1]![0] ?? ""}`.toUpperCase();
  }, [name]);

const DEPARTMENTS = [
  "Operations",
  "Finance",
  "People",
  "Product",
  "Design",
  "Security",
  "Engineering",
  "Marketing",
];

const DEPARTMENT_FILTER_OPTIONS = ["All", ...DEPARTMENTS];

export default function WorkHistoryPage() {
  const [tasks] = useState<Task[]>(initialTasks);
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"All" | Task["status"]>("All");

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const matchesDepartment =
          departmentFilter === "All" || task.department === departmentFilter;
        const matchesSearch = task.assignee
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase());
        const matchesStatus = statusFilter === "All" || task.status === statusFilter;
        return matchesDepartment && matchesSearch && matchesStatus;
      }),
    [tasks, departmentFilter, searchTerm, statusFilter],
  );

  const members = useMemo(() => {
    const map = filteredTasks.reduce<Map<string, MemberTasks>>((acc, task) => {
      const existing = acc.get(task.assignee);

      if (existing) {
        existing.tasks.push({
          id: task.id,
          title: task.title,
          priority: task.priority,
          status: task.status,
          elapsedSeconds: task.elapsedSeconds,
        });
      } else {
        acc.set(task.assignee, {
          name: task.assignee,
          department: task.department,
          tasks: [
            {
              id: task.id,
              title: task.title,
              priority: task.priority,
              status: task.status,
              elapsedSeconds: task.elapsedSeconds,
            },
          ],
        });
      }

      return acc;
    }, new Map());

    return Array.from(map.values());
  }, [filteredTasks]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Work history
        </h2>
        <p className="text-sm text-[color:var(--color-muted)]">
          Review everything your team has delivered across departments.
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
            {DEPARTMENT_FILTER_OPTIONS.map((department) => (
              <option key={department} value={department}>
                {department === "All" ? "All departments" : department}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-muted)]" />
        </div>
        <div className="relative w-full min-w-[180px] sm:w-48">
          <label className="sr-only" htmlFor="status-filter">
            Filter by status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "All" | Task["status"])
            }
            className="w-full appearance-none rounded-xl border border-border bg-input px-4 py-3 pr-12 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-0"
          >
            <option value="All">All statuses</option>
            <option value="Upcoming">Upcoming</option>
            <option value="In Progress">In Progress</option>
            <option value="Blocked">Blocked</option>
            <option value="Completed">Completed</option>
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-muted)]" />
        </div>
        <div className="relative ml-auto w-full min-w-[200px] sm:max-w-xs">
          <label className="sr-only" htmlFor="employee-search">
            Search by employee name
          </label>
          <input
            id="employee-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search with employee name"
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
      </div>
      <section className="grid gap-6 md:grid-cols-2">
        {members.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface/70 p-6 text-sm text-[color:var(--color-muted)] md:col-span-2">
            No matching tasks right now.
          </div>
        ) : (
          members.map((member) => {
            const initials = useInitials(member.name);

            return (
              <article
                key={member.name}
                className="flex h-full flex-col gap-6 rounded-3xl border border-border bg-surface/70 p-6 shadow-sm transition hover:border-foreground/40 hover:shadow-lg"
              >
                <header className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background text-base font-semibold uppercase tracking-wide text-foreground">
                      {initials}
                    </span>
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                      <p className="text-sm text-[color:var(--color-muted)]">
                        {member.department} team
                      </p>
                    </div>
                  </div>
                  <div className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground/80">
                    {member.tasks.length} task{member.tasks.length > 1 ? "s" : ""}
                  </div>
                </header>
                <div className="flex flex-col gap-3">
                  {member.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-col gap-4 rounded-2xl border border-border bg-background/70 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-foreground">{task.title}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 ${priorityStyles[task.priority]}`}
                          >
                            {task.priority}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 ${statusStyles[task.status]}`}
                          >
                            {task.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-[color:var(--color-muted)]">
                        <span>Total time: {formatElapsed(task.elapsedSeconds)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}

