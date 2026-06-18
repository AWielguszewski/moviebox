import type { ReactNode } from "react";

export function StatusMessage({
  icon,
  title,
  description,
  children,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      {icon && <div className="text-muted">{icon}</div>}
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      {description && (
        <p className="max-w-sm text-pretty text-sm text-muted">{description}</p>
      )}
      {children}
    </div>
  );
}
