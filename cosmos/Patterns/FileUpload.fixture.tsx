import { useRef, useState } from "react";
import { FileUpload } from "../../src/patterns/file-upload";

function Example({
  failFirst = false,
  initialDrop = false,
}: {
  failFirst?: boolean;
  initialDrop?: boolean;
}) {
  const [initialFile] = useState(() =>
    initialDrop
      ? new File(["fixture image"], "dropped-diagram.png", {
          type: "image/png",
        })
      : undefined,
  );
  const attempts = useRef(0);
  const [uploaded, setUploaded] = useState<string[]>([]);
  return (
    <section className="mx-auto flex w-full max-w-lg flex-col gap-4">
      <h3>Attachments</h3>
      <FileUpload
        initialFile={initialFile}
        accept="image/png,image/jpeg,application/pdf"
        maxSizeBytes={5 * 1024 * 1024}
        description="PNG, JPEG or PDF, up to 5 MB. Choose a file or drop it here."
        onUpload={async (file) => {
          attempts.current++;
          await new Promise((resolve) => setTimeout(resolve, 1200));
          if (failFirst && attempts.current === 1)
            throw new Error("The upload failed. Try again.");
          setUploaded((files) => [...files, file.name]);
        }}
      />
      {uploaded.length ? (
        <ul aria-label="Uploaded files" className="text-sm text-muted">
          {uploaded.map((name, index) => (
            <li key={index} className="break-all">
              {name}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export default {
  Default: <Example />,
  "Failure and retry": <Example failFirst />,
  "Initial dropped file": <Example initialDrop failFirst />,
  Disabled: (
    <section className="mx-auto flex w-full max-w-lg flex-col gap-4">
      <h3>Attachments</h3>
      <FileUpload isDisabled onUpload={async () => {}} />
    </section>
  ),
};
