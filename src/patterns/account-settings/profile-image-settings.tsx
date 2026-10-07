"use client";

import { UserAvatar } from "../user-avatar.js";

export type ProfileImageSettingsProps = { email: string; name: string };

export function ProfileImageSettings({
  email,
  name,
}: ProfileImageSettingsProps) {
  return (
    <div className="grid gap-3">
      <span className="text-sm font-medium">Gravatar Image</span>
      <a
        aria-label="Edit Gravatar image (opens in a new tab)"
        className="inline-flex w-fit rounded-lg focus-visible:outline-2 focus-visible:outline-focus"
        href="https://gravatar.com/profile/avatars"
        rel="noopener noreferrer"
        target="_blank"
      >
        <UserAvatar aria-hidden="true" email={email} name={name} size="md" />
      </a>
    </div>
  );
}
