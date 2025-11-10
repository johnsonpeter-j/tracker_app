# Task Tracker

Task Tracker is a role-aware, single-company dashboard built with Next.js (App Router) that helps Super Admins, Admins, and Employees keep tasks, departments, and user management in one place. The UI ships with responsive layouts, light/dark/system theme support, toast-driven feedback, and dedicated screens for settings, account maintenance, and password changes.

## Features

- **Role dashboards** – Home and work history views aggregate team tasks with inline status, priority, timers, and department filters.
- **User management** – Promote or demote Admins/Employees, inspect profiles, edit user details, or remove users with confirmation dialogs.
- **Department hub** – Create, view, edit, and delete departments with member counts and guard rails that prevent removing non-empty teams.
- **Personal tools** – Profile editor (with read-only system fields), change-password flow, and settings screen for theme selection and account deletion.
- **Theme controls** – Toggle between light, dark, or system appearance, with `react-toastify` notifications and persistence across sessions.
- **Mobile-ready layout** – Sidebar with hamburger toggle, sticky app bar, and vertically centered auth experiences.

## Getting Started

### Prerequisites

- Node.js 18 or later

### Installation

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser. The App Router will hot-reload as you edit files under `app/`.

## Available Scripts

| Script        | Description                                  |
| ------------- | --------------------------------------------- |
| `npm run dev` | Starts the Next.js development server         |
| `npm run build` | Creates a production build                   |
| `npm run start` | Runs the production build                    |
| `npm run lint`  | Executes ESLint across the project           |

## Project Structure

```
app/
  (auth)/         # Sign-in, sign-up, forgot password flows
  (main)/         # Authenticated routes (home, work history, users, departments, settings, profile, change-password)
  layout.tsx      # Root layout with ThemeProvider and ToastContainer
  globals.css     # Tailwind + design tokens
components/
  layout/         # Sidebar, app bar, shared layout pieces
  theme/          # Theme provider, toggle, utilities
  shared/         # Reusable SVG icons
```

## Key Routes

- `/home` – Team focus dashboard and owner-specific timers
- `/work-history` – Extended task archive with filters and summaries
- `/users` – Role, department, and account management
- `/departments` – Department CRUD with safe delete confirmation
- `/profile` – Editable profile (name, title, phone, location, bio)
- `/change-password` – Password update form with validation
- `/settings` – Theme controls and account deletion dialog

## Tooling & Libraries

- **Next.js 16** (App Router, TypeScript, Tailwind CSS 4)
- **react-toastify** for notifications
- **Custom ThemeProvider** for light/dark/system mode persistence

## Notes

- Delete actions rely on confirmation dialogs and toast feedback; replace placeholder handlers with real API calls in production.
- The project is scaffolded for role-based auth but does not include server-side authentication. Integrate your auth provider where needed.

## Deployment

1. Build the project: `npm run build`
2. Start the production server: `npm run start`

Refer to the [Next.js deployment guide](https://nextjs.org/docs/app/building-your-application/deploying) or your preferred hosting provider for additional steps.
