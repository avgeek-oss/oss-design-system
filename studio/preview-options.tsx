import { createContext, useContext, type ReactNode } from "react";

export type PreviewOptions = {
  failRequest?: boolean;
  slowResponse?: boolean;
  viewerRole?: boolean;
  slowAuthorization?: boolean;
  authorizationFailure?: boolean;
};
const PreviewOptionsContext = createContext<PreviewOptions>({});
export function PreviewOptionsProvider({
  value,
  children,
}: {
  value: PreviewOptions;
  children: ReactNode;
}) {
  return (
    <PreviewOptionsContext.Provider value={value}>
      {children}
    </PreviewOptionsContext.Provider>
  );
}
export function usePreviewOptions() {
  return useContext(PreviewOptionsContext);
}
