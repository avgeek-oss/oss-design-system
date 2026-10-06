"use client";

import {
  forwardRef,
  Fragment,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type ReactNode,
} from "react";
import { Highlight, type PrismTheme } from "prism-react-renderer";
import { SourceCodeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Widget, type WidgetActionProps } from "../data-display/widget.js";
import { toast } from "../overlays/toast.js";
import { cn } from "../lib/utils.js";

const htmlTheme: PrismTheme = {
  plain: { color: "var(--foreground)" },
  styles: [
    { types: ["tag"], style: { color: "var(--accent)" } },
    {
      types: ["attr-name"],
      style: { color: "var(--warning-soft-foreground)" },
    },
    {
      types: ["attr-value", "string"],
      style: { color: "var(--success-soft-foreground)" },
    },
    { types: ["punctuation"], style: { color: "var(--muted)" } },
  ],
};

const Root = forwardRef<HTMLDivElement, ComponentPropsWithRef<"div">>(
  ({ className, ...props }, ref) => (
    <Widget
      ref={ref}
      className={cn("min-w-0", className)}
      data-slot="code-block"
      {...props}
    />
  ),
);

const Header = forwardRef<HTMLDivElement, ComponentPropsWithRef<"div">>(
  ({ children, className, ...props }, ref) => (
    <Widget.Header
      ref={ref}
      className={className}
      data-slot="code-block-header"
      {...props}
    >
      {children}
    </Widget.Header>
  ),
);

const Filename = forwardRef<HTMLSpanElement, ComponentPropsWithRef<"span">>(
  ({ className, ...props }, ref) => (
    <Widget.Title
      ref={ref}
      icon={<HugeiconsIcon icon={SourceCodeIcon} />}
      className={cn("min-w-0 truncate text-muted", className)}
      data-slot="code-block-filename"
      {...props}
    />
  ),
);

const Code = forwardRef<
  HTMLPreElement,
  Omit<ComponentPropsWithRef<"pre">, "children"> & {
    code: string;
    language?: string;
  }
>(({ className, code, language, ...props }, ref) => (
  <Widget.Content className="p-0">
    <pre
      ref={ref}
      className={cn("m-0 overflow-x-auto p-4 text-sm", className)}
      data-language={language}
      data-slot="code-block-code"
      {...props}
    >
      {language === "html" ? (
        <Highlight code={code} language="markup" theme={htmlTheme}>
          {({ tokens, getTokenProps }) => (
            <code>
              {tokens.map((line, lineIndex) => (
                <Fragment key={lineIndex}>
                  {lineIndex > 0 ? "\n" : null}
                  {line.map((token, tokenIndex) => (
                    <span
                      key={tokenIndex}
                      style={getTokenProps({ token }).style}
                    >
                      {token.content}
                    </span>
                  ))}
                </Fragment>
              ))}
            </code>
          )}
        </Highlight>
      ) : (
        <code>{code}</code>
      )}
    </pre>
  </Widget.Content>
));

type CopyButtonProps = Omit<WidgetActionProps, "children" | "onPress"> & {
  code: string;
};

const CopyButton = forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ code, ...props }, ref) => {
    const pending = useRef(false);
    const [isPending, setIsPending] = useState(false);
    const copyCode = async () => {
      if (pending.current || props.isDisabled || props.isPending) return;
      pending.current = true;
      setIsPending(true);
      try {
        await navigator.clipboard.writeText(code);
        toast.success("Copied to clipboard.");
      } catch {
        toast.danger(
          "Could not copy to the clipboard. Select and copy the text instead.",
        );
      } finally {
        pending.current = false;
        setIsPending(false);
      }
    };

    return (
      <Widget.Action
        {...props}
        ref={ref}
        aria-label={props["aria-label"] ?? "Copy code"}
        data-slot="code-block-copy"
        isPending={isPending || props.isPending}
        onPress={copyCode}
      >
        Copy
      </Widget.Action>
    );
  },
);

Root.displayName = "CodeBlock.Root";
Header.displayName = "CodeBlock.Header";
Filename.displayName = "CodeBlock.Filename";
Code.displayName = "CodeBlock.Code";
CopyButton.displayName = "CodeBlock.CopyButton";

export const CodeBlock = Object.assign(Root, {
  Code,
  CopyButton,
  Filename,
  Header,
  Root,
});

export type CodeBlockProps = ComponentPropsWithRef<typeof Root> & {
  children?: ReactNode;
};
