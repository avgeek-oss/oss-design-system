import type { ReactNode } from "react";

export function PrimitivePreview({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="grid min-w-0 content-start gap-6 p-4">
      <header className="grid gap-1">
        <h1 className="text-lg font-medium">{title}</h1>
      </header>
      {children}
    </main>
  );
}

export function Variant({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="grid min-w-0 gap-3">
      <h2 className="text-sm font-medium">{title}</h2>
      <div className="flex min-w-0 flex-wrap items-start gap-3">{children}</div>
    </section>
  );
}
