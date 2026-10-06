"use client";

import { Widget } from "../../data-display/widget.js";
import { UserAvatar } from "../user-avatar.js";

export type ProfileImageSettingsProps = { email: string; name: string };

export function ProfileImageSettings({
  email,
  name,
}: ProfileImageSettingsProps) {
  return (
    <Widget>
      <Widget.Header>
        <Widget.Title>Appearance</Widget.Title>
      </Widget.Header>
      <Widget.Content className="grid gap-3">
        <span className="text-sm font-medium">Gravatar Image</span>
        <p className="text-sm text-muted">
          Click the image to update it on Gravatar.
        </p>
        <a
          aria-label="Edit Gravatar image (opens in a new tab)"
          className="inline-flex w-fit rounded-lg focus-visible:outline-2 focus-visible:outline-focus"
          href="https://gravatar.com/profile/avatars"
          rel="noopener noreferrer"
          target="_blank"
        >
          <UserAvatar aria-hidden="true" email={email} name={name} size="md" />
        </a>
      </Widget.Content>
    </Widget>
  );
}
