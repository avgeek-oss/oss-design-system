"use client";

import { useId, useRef, useState } from "react";
import { Button } from "../../buttons/button.js";
import { Input } from "../../forms/input.js";
import { Label } from "../../forms/label.js";
import { Field } from "../../forms/field.js";
import { Widget } from "../../data-display/widget.js";
import { toast } from "../../overlays/toast.js";
import { useOverlaySuspension } from "../../overlays/overlay-suspension.js";
import { createNameSchema } from "./schemas.js";

export function NameSettingsForm({
  title,
  label = "Name",
  value,
  maxLength = 120,
  onSave,
}: {
  title: string;
  label?: string;
  value: string;
  maxLength?: number;
  onSave: (name: string) => Promise<void>;
}) {
  const id = useId();
  const [draft, setDraft] = useState(value);
  const [busy, setBusy] = useState(false);
  const pending = useRef<symbol | null>(null);
  const suspension = useOverlaySuspension();
  return (
    <Widget>
      <Widget.Header>
        <Widget.Title>{title}</Widget.Title>
      </Widget.Header>
      <Widget.Content>
        <form
          noValidate
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            if (pending.current || suspension.isSuspended) return;
            const parsed = createNameSchema(maxLength).safeParse(draft);
            if (!parsed.success) {
              toast.danger(parsed.error.issues[0]?.message ?? "Enter a name");
              event.currentTarget.querySelector("input")?.focus();
              return;
            }
            const isCurrent = suspension.capture();
            const request = Symbol();
            pending.current = request;
            setBusy(true);
            try {
              await onSave(parsed.data);
              if (isCurrent()) toast.success("Changes saved");
            } catch (error) {
              if (isCurrent())
                toast.danger(
                  error instanceof Error
                    ? error.message
                    : "Could not save changes",
                );
            } finally {
              if (pending.current === request) {
                pending.current = null;
                setBusy(false);
              }
            }
          }}
        >
          <Field>
            <Label htmlFor={id} isRequired>
              {label}
            </Label>
            <Input
              variant="secondary"
              id={id}
              required
              value={draft}
              maxLength={maxLength}
              disabled={busy}
              onChange={(event) => setDraft(event.target.value)}
            />
          </Field>
          <div>
            <Button type="submit" isDisabled={busy || draft.trim() === value}>
              {busy ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </Widget.Content>
    </Widget>
  );
}
