import { useEffect, type ReactNode } from "react";
import type { Preview } from "@storybook/react-vite";
import { create } from "storybook/theming";
import {
  Title,
  Description,
  Primary,
  Controls,
  ArgTypes,
  Stories,
  useOf,
} from "@storybook/addon-docs/blocks";
import { Providers, useTheme } from "../src/utilities/providers";
import { Toast } from "../src/overlays/toast";
import { PreviewOptionsProvider } from "../studio/preview-options";
import "../src/styles/globals.css";
import "./preview.css";

function ThemePreview({
  theme,
  children,
}: {
  theme: string;
  children: ReactNode;
}) {
  const { setThemeMode } = useTheme();
  useEffect(() => {
    setThemeMode(theme === "dark" ? "dark" : "light");
  }, [theme, setThemeMode]);
  return <>{children}</>;
}
function CatalogueDocs() {
  const { preparedMeta } = useOf("meta", ["meta"]);
  const { story } = useOf("story", ["story"]);
  const properties = Object.keys(story.argTypes ?? {});
  return (
    <>
      <Title />
      <Description />
      <Primary />
      {Object.keys(story.initialArgs ?? {}).length > 0 ? (
        <Controls include={Object.keys(story.initialArgs)} />
      ) : properties.length > 0 ? (
        <ArgTypes />
      ) : null}
      <section className="catalogue-reference">
        <h2>API reference</h2>
        <p>
          <a href="https://github.com/avgeek-oss/oss-design-system/blob/main/docs/components.md">
            Public exports and component source
          </a>
          {preparedMeta.title.startsWith("Primitives/") && (
            <>
              {" "}
              ·{" "}
              <a href="https://www.heroui.com/docs/react/components">
                Upstream HeroUI component APIs
              </a>
            </>
          )}
        </p>
      </section>
      <Stories includePrimary={false} />
    </>
  );
}
const preview: Preview = {
  tags: ["autodocs"],
  globalTypes: {
    theme: {
      description: "Preview appearance",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  decorators: [
    (Story, context) => (
      <Providers>
        <ThemePreview theme={String(context.globals.theme)}>
          <PreviewOptionsProvider value={context.args}>
            <div className="catalogue-example">
              <Story />
            </div>
            <Toast.Provider placement="bottom" />
          </PreviewOptionsProvider>
        </ThemePreview>
      </Providers>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      page: CatalogueDocs,
      theme: create({
        base: "light",
        fontBase: '"Inter Variable", sans-serif',
      }),
      source: { type: "dynamic" },
    },
    controls: { expanded: true },
    options: {
      storySort: {
        order: ["Primitives", "Patterns", "Layouts"],
        method: "alphabetical",
      },
    },
  },
};
export default preview;
