"use client";

import { useId, useState } from "react";
import { Widget } from "../../data-display/widget.js";
import { Field } from "../../forms/field.js";
import { Label } from "../../forms/label.js";
import { Textarea } from "../../forms/textarea.js";
import { toast } from "../../overlays/toast.js";
import { AuthForm } from "../auth/auth-form.js";
import { NameSettingsForm } from "../settings/name-form.js";
import { createNameSchema } from "../settings/schemas.js";

export type TeamGeneralSettingsProps = { maxLength?: number } & (
  | { mode?: "name"; value: string; onSave: (name: string) => Promise<void> }
  | {
      mode: "details";
      value: { name: string; description: string };
      maxDescriptionLength?: number;
      onSave: (values: { name: string; description: string }) => Promise<void>;
    }
);

export function TeamGeneralSettings(props: TeamGeneralSettingsProps) {
  return props.mode === "details" ? (
    <TeamDetailsSettings key={JSON.stringify(props.value)} {...props} />
  ) : (
    <NameSettingsForm
      title="Team details"
      label="Team name"
      value={props.value}
      maxLength={props.maxLength}
      onSave={props.onSave}
    />
  );
}
function TeamDetailsSettings({
  value,
  maxLength = 120,
  maxDescriptionLength = 500,
  onSave,
}: Extract<TeamGeneralSettingsProps, { mode: "details" }>) {
  const id = useId();
  const [description, setDescription] = useState(value.description);
  const [busy, setBusy] = useState(false);
  return (
    <Widget>
      <Widget.Header>
        <Widget.Title>Team details</Widget.Title>
      </Widget.Header>
      <Widget.Content>
        <AuthForm
          variant="secondary"
          submitLabel="Save"
          submitButtonClassName="w-auto"
          fields={[
            {
              name: "name",
              label: "Team name",
              required: true,
              maxLength,
              defaultValue: value.name,
            },
          ]}
          onSubmit={async (values) => {
            const parsed = createNameSchema(maxLength).safeParse(values.name);
            if (!parsed.success)
              throw new Error(
                parsed.error.issues[0]?.message ?? "Enter a team name",
              );
            if (description.length > maxDescriptionLength)
              throw new Error(
                `Description must be ${maxDescriptionLength} characters or fewer.`,
              );
            setBusy(true);
            try {
              await onSave({ name: parsed.data, description });
              toast.success("Changes saved");
            } finally {
              setBusy(false);
            }
          }}
        >
          <Field>
            <Label htmlFor={id}>Description</Label>
            <Textarea
              id={id}
              name="description"
              variant="secondary"
              rows={3}
              disabled={busy}
              maxLength={maxDescriptionLength}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </Field>
        </AuthForm>
      </Widget.Content>
    </Widget>
  );
}
