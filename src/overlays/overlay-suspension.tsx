"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";

type Suspension = {
  isSuspended: boolean;
  capture: () => () => boolean;
};
const SuspensionContext = createContext<Suspension>({
  isSuspended: false,
  capture: () => () => true,
});

export type OverlaySuspensionScopeProps = {
  isSuspended: boolean;
  children: ReactNode;
};

export function OverlaySuspensionScope({
  isSuspended,
  children,
}: OverlaySuspensionScopeProps) {
  const parent = useContext(SuspensionContext);
  const suspended = isSuspended || parent.isSuspended;
  const state = useRef({ generation: 0, suspended });
  useLayoutEffect(() => {
    const current = state.current;
    current.suspended = suspended;
    return () => {
      current.generation++;
    };
  }, [suspended]);
  const capture = useCallback(() => {
    const generation = state.current.generation;
    const parentIsCurrent = parent.capture();
    return () =>
      !state.current.suspended &&
      state.current.generation === generation &&
      parentIsCurrent();
  }, [parent]);
  return (
    <SuspensionContext value={{ isSuspended: suspended, capture }}>
      {children}
    </SuspensionContext>
  );
}

/** Capture before awaiting an action; check before showing feedback or changing UI. */
export function useOverlaySuspension(): Suspension {
  const scope = useContext(SuspensionContext);
  const lifetime = useRef(0);
  useLayoutEffect(
    () => () => {
      lifetime.current++;
    },
    [],
  );
  const capture = useCallback(() => {
    const generation = lifetime.current;
    const isCurrent = scope.capture();
    return () => lifetime.current === generation && isCurrent();
  }, [scope]);
  return { isSuspended: scope.isSuspended, capture };
}
