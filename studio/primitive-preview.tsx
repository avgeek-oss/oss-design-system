import type { ReactNode } from "react";

export function PrimitivePreview({
  title: _title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="grid min-w-0 content-start gap-6 p-4">{children}</main>
  );
}

export function Variant({
  title: _title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="grid min-w-0 gap-3">
      <div className="flex min-w-0 flex-wrap items-start gap-3">{children}</div>
    </section>
  );
}
