"use client";

import { useRef, useState, type ReactNode } from "react";
import { Widget } from "../../data-display/widget.js";
import { Button } from "../../buttons/button.js";
import { FieldDescription } from "../../forms/field.js";
import { toast } from "../../overlays/toast.js";
import {
  DateTimePreferenceFields,
  type DateTimePreferenceOptions,
  type DateTimePreferences,
} from "../settings/date-time-preference-fields.js";

export type PreferencesSettingsProps = {
  value: DateTimePreferences;
  options: DateTimePreferenceOptions;
  formatPreview?: (preferences: DateTimePreferences) => ReactNode;
  onSave: (preferences: DateTimePreferences) => Promise<void>;
};

export function PreferencesSettings({
  value,
  options,
  formatPreview,
  onSave,
}: PreferencesSettingsProps) {
  const [draft, setDraft] = useState(value);
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const changed =
    draft.dateFormat !== value.dateFormat ||
    draft.timeFormat !== value.timeFormat ||
    draft.timeZone !== value.timeZone;
  return (
    <Widget>
      <Widget.Header>
        <Widget.Title>Date and time</Widget.Title>
      </Widget.Header>
      <Widget.Content>
        <form
          className="grid gap-5"
          onSubmit={async (event) => {
            event.preventDefault();
            if (pending.current || !changed) return;
            pending.current = true;
            setBusy(true);
            try {
              await onSave(draft);
              toast.success("Preferences updated");
            } catch (cause) {
              toast.danger(
                cause instanceof Error
                  ? cause.message
                  : "Could not save preferences. Try again.",
              );
            } finally {
              pending.current = false;
              setBusy(false);
            }
          }}
        >
          <DateTimePreferenceFields
            options={options}
            preferences={draft}
            onChange={setDraft}
            variant="secondary"
            disabled={busy}
          />
          <div className="grid gap-3">
            {formatPreview && (
              <div className="grid" aria-live="polite">
                <span className="text-xs text-muted">Preview</span>
                <span className="text-sm tabular-nums">
                  {formatPreview(draft)}
                </span>
                <span className="text-xs text-muted">{draft.timeZone}</span>
              </div>
            )}
            <FieldDescription>
              Applies to dates and times throughout the app and your personal
              API keys.
            </FieldDescription>
          </div>
          <Button className="w-fit" type="submit" isDisabled={busy || !changed}>
            {busy ? "Saving…" : "Save"}
          </Button>
        </form>
      </Widget.Content>
    </Widget>
  );
}
