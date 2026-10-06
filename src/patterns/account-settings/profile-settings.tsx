"use client";

import type { ComponentProps } from "react";
import { NameSettingsForm } from "../settings/name-form.js";

export type ProfileSettingsProps = Omit<
  ComponentProps<typeof NameSettingsForm>,
  "title"
> & { title?: string };

export function ProfileSettings({
  title = "Profile details",
  ...props
}: ProfileSettingsProps) {
  return <NameSettingsForm title={title} {...props} />;
}
