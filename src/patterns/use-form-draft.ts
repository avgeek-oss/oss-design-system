"use client";

import { useState } from "react";
import type { AuthField } from "./auth/auth-form.js";

/** Keep uncontrolled field drafts above an overlay that can be suspended. */
export function useFormDraft(fields: AuthField[]): AuthField[] {
  const [values, setValues] = useState<Record<string, AuthField["value"]>>(() =>
    Object.fromEntries(
      fields
        .filter((field) => field.type !== "password")
        .map((field) => [field.name, field.defaultValue ?? ""]),
    ),
  );
  return fields.map((original) => {
    if (original.type === "password") return original;
    const { defaultValue: _defaultValue, ...field } = original;
    return {
      ...field,
      value: field.value ?? values[field.name] ?? "",
      onChange: (event) => {
        const value = event.currentTarget.value;
        setValues((current) => ({ ...current, [field.name]: value }));
        field.onChange?.(event);
      },
    };
  });
}
