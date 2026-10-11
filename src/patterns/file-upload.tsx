"use client";

import {
  forwardRef,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type DragEvent,
  type ReactNode,
} from "react";
import { Button } from "../buttons/button.js";
import { Spinner } from "../feedback/spinner.js";
import { cn } from "../lib/utils.js";
import { toast } from "../overlays/toast.js";
import { useAsyncAction } from "./use-async-action.js";

export type FileUploadProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "onDrop" | "onDragOver" | "onDragEnter" | "onDragLeave"
> & {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  maxSizeBytes?: number;
  isDisabled?: boolean;
  label?: string;
  description?: ReactNode;
};

function acceptsFile(file: File, accept: string) {
  const rules = accept.split(",").map((rule) => rule.trim().toLowerCase());
  const type = file.type.toLowerCase();
  return rules.some((rule) => {
    if (!rule || rule === "*/*") return true;
    if (rule.startsWith(".")) return file.name.toLowerCase().endsWith(rule);
    if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}

export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  function FileUpload(
    {
      onUpload,
      accept = "image/*,application/pdf",
      maxSizeBytes = 10 * 1024 * 1024,
      isDisabled = false,
      label = "Upload attachment",
      description = "Choose a file or drop it here.",
      className,
      ...props
    },
    ref,
  ) {
    const descriptionId = useId();
    const input = useRef<HTMLInputElement>(null);
    const lock = useRef(false);
    const dragDepth = useRef(0);
    const [isDragging, setDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const action = useAsyncAction("Could not upload the file");
    const disabled = isDisabled || action.isPending;

    async function upload(file: File) {
      if (isDisabled || lock.current) return;
      if (!acceptsFile(file, accept)) {
        toast.danger("Choose a supported file type.");
        return;
      }
      if (file.size === 0) {
        toast.danger("Choose a file that is not empty.");
        return;
      }
      if (file.size > maxSizeBytes) {
        toast.danger("This file exceeds the upload size limit.");
        return;
      }
      lock.current = true;
      setSelectedFile(file);
      try {
        const result = await action.run(() => onUpload(file));
        if (result.ok) {
          setSelectedFile(null);
        }
      } finally {
        lock.current = false;
      }
    }

    function acceptsDrag(event: DragEvent<HTMLDivElement>) {
      return event.dataTransfer.types.includes("Files");
    }

    return (
      <div
        {...props}
        ref={ref}
        aria-busy={action.isPending}
        className={cn(
          "flex min-w-0 flex-col gap-3 rounded-xl border border-dashed p-4",
          isDragging ? "border-accent bg-accent/5" : "border-separator",
          className,
        )}
        onDragEnter={(event) => {
          if (!acceptsDrag(event)) return;
          event.preventDefault();
          if (disabled) return;
          dragDepth.current++;
          setDragging(true);
        }}
        onDragOver={(event) => {
          if (!acceptsDrag(event)) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = disabled ? "none" : "copy";
        }}
        onDragLeave={(event) => {
          if (!acceptsDrag(event)) return;
          event.preventDefault();
          dragDepth.current = Math.max(0, dragDepth.current - 1);
          if (dragDepth.current === 0) setDragging(false);
        }}
        onDrop={async (event) => {
          if (!acceptsDrag(event)) return;
          event.preventDefault();
          dragDepth.current = 0;
          setDragging(false);
          if (disabled || lock.current) return;
          const files = event.dataTransfer.files;
          if (files.length !== 1) {
            toast.danger("Choose one file at a time.");
            return;
          }
          const file = files.item(0);
          if (file) await upload(file);
        }}
      >
        <input
          ref={input}
          type="file"
          accept={accept}
          hidden
          aria-label={label}
          disabled={disabled}
          onChange={async (event) => {
            const file = event.currentTarget.files?.item(0);
            event.currentTarget.value = "";
            if (file) await upload(file);
          }}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            isDisabled={disabled}
            isPending={action.isPending}
            aria-describedby={description ? descriptionId : undefined}
            onPress={async () => {
              if (selectedFile) await upload(selectedFile);
              else input.current?.click();
            }}
          >
            <span className="grid">
              <span
                className={cn(
                  "col-start-1 row-start-1",
                  (action.isPending || selectedFile) && "invisible",
                )}
                aria-hidden={action.isPending || !!selectedFile}
              >
                {label}
              </span>
              <span
                className={cn(
                  "col-start-1 row-start-1",
                  (action.isPending || !selectedFile) && "invisible",
                )}
                aria-hidden={action.isPending || !selectedFile}
              >
                Retry upload
              </span>
              <span
                className={cn(
                  "col-start-1 row-start-1 inline-flex items-center justify-center gap-2",
                  !action.isPending && "invisible",
                )}
                aria-hidden={!action.isPending}
              >
                <Spinner size="sm" aria-hidden="true" />
                Uploading…
              </span>
            </span>
          </Button>
          {selectedFile && !action.isPending ? (
            <Button
              type="button"
              variant="secondary"
              isDisabled={isDisabled}
              onPress={() => input.current?.click()}
            >
              Choose another file
            </Button>
          ) : null}
        </div>
        {description ? (
          <p id={descriptionId} className="text-sm text-muted">
            {description}
          </p>
        ) : null}
        <p role="status" className="break-all text-sm text-muted">
          {selectedFile?.name}
        </p>
      </div>
    );
  },
);
