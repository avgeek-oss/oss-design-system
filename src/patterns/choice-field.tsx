"use client";

import type { ReactNode } from "react";
import { Select, ListBox } from "../forms/select.js";
import { Label } from "../forms/label.js";

export type ChoiceOption<T extends string = string> = {
  id: T;
  label: string;
  description?: string;
  icon?: ReactNode;
};
export type ChoiceFieldProps<T extends string = string> = {
  label: string;
  value: T;
  options: readonly ChoiceOption<T>[];
  onChange: (value: T) => void;
  isDisabled?: boolean;
  isRequired?: boolean;
};
export function ChoiceField<T extends string>({
  label,
  value,
  options,
  onChange,
  isDisabled,
  isRequired,
}: ChoiceFieldProps<T>) {
  const selected = options.find((option) => option.id === value);
  return (
    <Select
      aria-label={label}
      variant="secondary"
      selectedKey={value}
      isDisabled={isDisabled}
      isRequired={isRequired}
      onSelectionChange={(key) => {
        const option = options.find((item) => item.id === key);
        if (option) onChange(option.id);
      }}
    >
      <Label isRequired={isRequired}>{label}</Label>
      <Select.Trigger>
        <Select.Value className="flex min-w-0 flex-1 items-center gap-2">
          {selected?.icon}
          <span className="truncate">{selected?.label}</span>
        </Select.Value>
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {options.map((option) => (
            <ListBox.Item
              id={option.id}
              key={option.id}
              textValue={option.label}
            >
              <div className="grid min-w-0 flex-1 gap-1">
                <span className="flex items-center gap-2">
                  {option.icon}
                  {option.label}
                </span>
                {option.description ? (
                  <span className="text-xs font-normal whitespace-normal text-muted">
                    {option.description}
                  </span>
                ) : null}
              </div>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
