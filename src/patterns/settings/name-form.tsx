"use client";

import { useId, useRef, useState } from "react";
import { Button } from "../../buttons/button.js";
import { Input } from "../../forms/input.js";
import { Label } from "../../forms/label.js";
import { Field } from "../../forms/field.js";
import { Widget } from "../../data-display/widget.js";
import { toast } from "../../overlays/toast.js";
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
  const pending = useRef(false);
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
            if (pending.current) return;
            const parsed = createNameSchema(maxLength).safeParse(draft);
            if (!parsed.success) {
              toast.danger(parsed.error.issues[0]?.message ?? "Enter a name");
              event.currentTarget.querySelector("input")?.focus();
              return;
            }
            pending.current = true;
            setBusy(true);
            try {
              await onSave(parsed.data);
              toast.success("Changes saved");
            } catch (error) {
              toast.danger(
                error instanceof Error
                  ? error.message
                  : "Could not save changes",
              );
            } finally {
              pending.current = false;
              setBusy(false);
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
