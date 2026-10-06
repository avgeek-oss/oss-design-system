"use client";

import { Chip as HeroChip, type ChipRootProps } from "@heroui/react";
import type { JSX } from "react";

function ChipRoot<E extends keyof JSX.IntrinsicElements = "span">(
  props: ChipRootProps<E> &
    Omit<JSX.IntrinsicElements[E], keyof ChipRootProps<E>>,
) {
  return <HeroChip.Root<E> {...props} variant={props.variant ?? "soft"} />;
}

export const Chip = Object.assign(ChipRoot, {
  Root: ChipRoot,
  Label: HeroChip.Label,
});
export type Chip = HeroChip;
export { chipVariants } from "@heroui/react";
export type { ChipRootProps as ChipProps } from "@heroui/react";
