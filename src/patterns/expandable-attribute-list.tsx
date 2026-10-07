"use client";

import {
  forwardRef,
  useId,
  type ComponentPropsWithRef,
  type ReactNode,
} from "react";
import {
  Button,
  Disclosure,
  DisclosurePanel,
  type DisclosureProps,
} from "react-aria-components";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import {
  AttributeListFrame,
  attributeListRowSpacing,
} from "../data-display/attribute-list-frame.js";
import { cn } from "../lib/utils.js";

export interface ExpandableAttributeListProps extends Omit<
  ComponentPropsWithRef<"div">,
  "title"
> {
  title: ReactNode;
  icon?: ReactNode;
  footer?: ReactNode;
}

const Root = forwardRef<HTMLDivElement, ExpandableAttributeListProps>(
  ({ children, title, className, ...props }, ref) => {
    const titleId = useId();
    return (
      <AttributeListFrame
        ref={ref}
        title={title}
        titleId={titleId}
        className={cn("expandable-attribute-list", className)}
        {...props}
      >
        <ul
          aria-labelledby={titleId}
          className="expandable-attribute-list__items"
        >
          {children}
        </ul>
      </AttributeListFrame>
    );
  },
);
Root.displayName = "ExpandableAttributeList.Root";

export interface ExpandableAttributeListItemProps extends Omit<
  ComponentPropsWithRef<"li">,
  "value"
> {
  label: ReactNode;
  value: ReactNode;
  leadingContent?: ReactNode;
  icon?: ReactNode;
  isExpanded?: DisclosureProps["isExpanded"];
  defaultExpanded?: DisclosureProps["defaultExpanded"];
  onExpandedChange?: DisclosureProps["onExpandedChange"];
}

const Item = forwardRef<HTMLLIElement, ExpandableAttributeListItemProps>(
  (
    {
      children,
      label,
      value,
      leadingContent,
      icon,
      className,
      isExpanded,
      defaultExpanded,
      onExpandedChange,
      ...props
    },
    ref,
  ) => {
    const expandable = children != null && typeof children !== "boolean";
    const row = (
      <>
        <span className="expandable-attribute-list__leading">
          {leadingContent}
        </span>
        <span aria-hidden="true" className="expandable-attribute-list__icon">
          {icon}
        </span>
        <span className="expandable-attribute-list__label">{label}</span>
        <span className="expandable-attribute-list__value">{value}</span>
        <span
          aria-hidden="true"
          className="expandable-attribute-list__indicator"
        >
          {expandable ? (
            <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
          ) : null}
        </span>
      </>
    );
    return (
      <li
        ref={ref}
        className={cn("expandable-attribute-list__item", className)}
        {...props}
      >
        {expandable ? (
          <Disclosure
            className="expandable-attribute-list__disclosure"
            isExpanded={isExpanded}
            defaultExpanded={defaultExpanded}
            onExpandedChange={onExpandedChange}
          >
            <Button
              slot="trigger"
              className={cn(
                "expandable-attribute-list__row",
                attributeListRowSpacing,
              )}
            >
              {row}
            </Button>
            <DisclosurePanel className="expandable-attribute-list__panel">
              <div className="expandable-attribute-list__details">
                {children}
              </div>
            </DisclosurePanel>
          </Disclosure>
        ) : (
          <div
            className={cn(
              "expandable-attribute-list__row",
              attributeListRowSpacing,
            )}
          >
            {row}
          </div>
        )}
      </li>
    );
  },
);
Item.displayName = "ExpandableAttributeList.Item";
export const ExpandableAttributeList = Object.assign(Root, { Root, Item });
export {
  Root as ExpandableAttributeListRoot,
  Item as ExpandableAttributeListItem,
};
