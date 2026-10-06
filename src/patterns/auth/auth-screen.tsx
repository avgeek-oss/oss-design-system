import type { ReactNode, Ref } from "react";
import {
  IdentityAuthFrame,
  IdentityAuthHeading,
} from "./identity-auth-frame.js";

export function AuthScreen({
  brand,
  brandEndContent,
  headingRef,
  title,
  description,
  children,
}: {
  brand: ReactNode;
  brandEndContent?: ReactNode;
  headingRef?: Ref<HTMLDivElement>;
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <IdentityAuthFrame>
      <div className="content-grid">
        <div className="flex min-w-0 items-center justify-between gap-4">
          {brand}
          {brandEndContent}
        </div>
        <div
          ref={headingRef}
          tabIndex={headingRef ? -1 : undefined}
          className="outline-none"
        >
          <IdentityAuthHeading title={title} titleElementType="h1">
            {description}
          </IdentityAuthHeading>
        </div>
        {children}
      </div>
    </IdentityAuthFrame>
  );
}
