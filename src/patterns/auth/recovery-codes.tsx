"use client";
import { useRef, useState } from "react";
import { Button } from "../../buttons/button.js";
import { toast } from "../../overlays/toast.js";

export function RecoveryCodes({
  codes,
  filename = "recovery-codes.txt",
  onContinue,
}: {
  codes: readonly string[];
  filename?: string;
  onContinue: () => void;
}) {
  const pending = useRef(false);
  const [isPending, setIsPending] = useState(false);
  const text = codes.join("\n") + "\n";
  return (
    <div className="content-grid">
      <p className="text-sm text-muted">
        Save these codes somewhere safe. Each code can be used once.
      </p>
      <ul
        className="grid grid-cols-1 gap-2 rounded-xl bg-default p-4 font-mono text-sm sm:grid-cols-2"
        aria-label="Recovery codes"
      >
        {codes.map((code) => (
          <li key={code}>{code}</li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          isPending={isPending}
          onPress={async () => {
            if (pending.current) return;
            pending.current = true;
            setIsPending(true);
            try {
              await navigator.clipboard.writeText(text);
              toast.success("Recovery codes copied");
            } catch {
              toast.danger("Could not copy recovery codes");
            } finally {
              pending.current = false;
              setIsPending(false);
            }
          }}
        >
          Copy codes
        </Button>
        <Button
          variant="secondary"
          onPress={() => {
            const url = URL.createObjectURL(
              new Blob([text], { type: "text/plain" }),
            );
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            link.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
          }}
        >
          Download .txt
        </Button>
      </div>
      <Button onPress={onContinue}>Continue</Button>
    </div>
  );
}
