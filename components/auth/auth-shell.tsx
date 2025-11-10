import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col gap-8 rounded-3xl border border-border bg-surface p-8 shadow-sm sm:p-10">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-sm text-[color:var(--color-muted)]">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-6">{children}</div>
        {footer ? <div className="text-center text-sm text-[color:var(--color-muted)]">{footer}</div> : null}
      </div>
    </div>
  );
}



