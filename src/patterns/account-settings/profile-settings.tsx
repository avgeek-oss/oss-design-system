"use client";

import type { ComponentProps } from "react";
import { NameSettingsForm } from "../settings/name-form.js";

export type ProfileSettingsProps = Omit<
  ComponentProps<typeof NameSettingsForm>,
  "title" | "children"
> & {
  title?: string;
  /** @deprecated Profile details no longer displays an avatar. */
  email?: string;
};

export function ProfileSettings({
  title = "Profile details",
  label = "Your Name",
  email: _email,
  ...props
}: ProfileSettingsProps) {
  return <NameSettingsForm title={title} label={label} {...props} />;
}
