"use client";
import type { ReactNode } from "react";
import { UserAvatar } from "./user-avatar.js";
import { Dropdown, Header } from "../overlays/dropdown.js";
import { useMobileNavigation } from "../hooks/app-navigation.js";

export type AccountMenuGroup = {
  id: string;
  label: string;
  items: {
    id: string;
    label: string;
    icon: ReactNode;
    destructive?: boolean;
  }[];
};
export function SidebarAccountMenu({
  name,
  email,
  teamName,
  avatarUrl,
  groups,
  onAction,
}: {
  name: string;
  email: string;
  teamName: string;
  avatarUrl?: string;
  groups: AccountMenuGroup[];
  onAction: (id: string) => void;
}) {
  const { close } = useMobileNavigation();
  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label={`Account menu for ${name}`}
        className="sidebar-identity flex min-h-16 w-full min-w-0 items-center gap-2.5 px-4 py-3 text-start text-sm"
      >
        <UserAvatar
          aria-hidden
          className="size-9 shrink-0"
          email={email}
          name={name}
          src={avatarUrl}
        />
        <span className="grid min-w-0 flex-1 gap-0.25">
          <span className="truncate font-medium">{name}</span>
          <span className="truncate text-xs text-foreground/70">
            {teamName}
          </span>
        </span>
      </Dropdown.Trigger>
      <Dropdown.Popover
        placement="top start"
        className="w-60 max-w-[calc(100vw-2rem)] rounded-2xl border border-separator"
      >
        <div className="grid gap-0.25 border-b border-separator px-3 py-3">
          <span className="truncate text-sm font-medium">{name}</span>
          <span className="truncate text-xs text-muted">{email}</span>
        </div>
        <Dropdown.Menu
          aria-label="Account menu"
          className="gap-0 p-0"
          onAction={(key) => {
            onAction(String(key));
            close();
          }}
        >
          {groups.map((group) => (
            <Dropdown.Section
              key={group.id}
              aria-label={group.label}
              className="w-full px-1.5 py-1.5 [&+&]:border-t [&+&]:border-separator"
            >
              <Header>{group.label}</Header>
              {group.items.map((item) => (
                <Dropdown.Item
                  id={item.id}
                  key={item.id}
                  textValue={item.label}
                  variant={item.destructive ? "danger" : undefined}
                  className={item.destructive ? "text-danger" : undefined}
                >
                  <span
                    aria-hidden
                    className="text-inherit [&_svg]:size-4 [&_svg]:text-inherit"
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Dropdown.Item>
              ))}
            </Dropdown.Section>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
