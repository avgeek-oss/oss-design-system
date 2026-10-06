"use client";

import type { ReactNode } from "react";
import { Modal } from "../../overlays/modal.js";
import { Button } from "../../buttons/button.js";
import { CodeBlock } from "../../typography/code-block.js";

export type EventDetailField = {
  id: string;
  label: string;
  value: ReactNode;
  copy?: boolean;
};
export type EventDetailProps = Omit<EventDetailField, "id">;
export function EventDetail({ label, value, copy = false }: EventDetailProps) {
  return (
    <div className="grid min-w-0 content-start gap-1">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="flex min-w-0 items-start gap-2 text-sm">
        <span className="min-w-0 break-words [overflow-wrap:anywhere]">
          {value ?? "—"}
        </span>
        {copy && typeof value === "string" ? (
          <CodeBlock.CopyButton
            code={value}
            aria-label={`Copy ${label.toLowerCase()}`}
          />
        ) : null}
      </dd>
    </div>
  );
}
export type EventDetailsDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  fields?: readonly EventDetailField[];
  children?: ReactNode;
};
export function EventDetailsDialog({
  isOpen,
  onOpenChange,
  title,
  fields = [],
  children,
}: EventDetailsDialogProps) {
  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container size="lg" scroll="inside">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Heading>{title}</Modal.Heading>
            <Modal.CloseTrigger />
          </Modal.Header>
          <Modal.Body>
            <dl className="grid min-w-0 gap-4 sm:grid-cols-2">
              {fields.map(({ id, ...field }) => (
                <EventDetail key={id} {...field} />
              ))}
              {children}
            </dl>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onPress={() => onOpenChange(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
