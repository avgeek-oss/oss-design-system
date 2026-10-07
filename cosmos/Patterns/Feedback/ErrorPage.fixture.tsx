import { useState } from "react";
import {
  ErrorPage,
  type ErrorPageStatus,
} from "../../../src/patterns/feedback/error-page";

function Example({ status }: { status: ErrorPageStatus }) {
  const [retried, setRetried] = useState(false);
  return (
    <ErrorPage
      status={status}
      returnHref="/"
      returnLabel="Go to overview"
      {...(status === "server-error" || status === "unavailable"
        ? { onRetry: () => setRetried(true) }
        : {})}
    >
      {retried && <p role="status">Retry requested</p>}
    </ErrorPage>
  );
}

export default {
  "404": <Example status="not-found" />,
  "500": <Example status="server-error" />,
  Unavailable: <Example status="unavailable" />,
  "403": <Example status="forbidden" />,
  Pending: (
    <ErrorPage
      status="unavailable"
      isPending
      onRetry={() => {}}
      returnHref="/"
    />
  ),
};
