"use client";

import type { ComponentProps } from "react";
import { NameSettingsForm } from "../settings/name-form.js";
import { ProfileImageSettings } from "./profile-image-settings.js";

export type ProfileSettingsProps = Omit<
  ComponentProps<typeof NameSettingsForm>,
  "title" | "children"
> & { title?: string; email?: string };

export function ProfileSettings({
  title = "Profile details",
  label = "Your Name",
  email,
  ...props
}: ProfileSettingsProps) {
  return (
    <NameSettingsForm title={title} label={label} {...props}>
      {email ? <ProfileImageSettings email={email} name={props.value} /> : null}
    </NameSettingsForm>
  );
}
