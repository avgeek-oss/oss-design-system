import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";
import { exampleSource } from "./example-source";

const config: StorybookConfig = {
  core: { disableTelemetry: true },
  stories: ["../stories/**/*.stories.tsx"],
  staticDirs: [
    { from: "../public", to: "/" },
    { from: "../node_modules/@fontsource-variable/inter/files", to: "/fonts" },
  ],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
    "@storybook/addon-vitest",
  ],
  framework: "@storybook/react-vite",
  typescript: { reactDocgen: "react-docgen-typescript" },
  viteFinal(config) {
    config.server = {
      ...config.server,
      watch: {
        ...config.server?.watch,
        ignored: ["**/artifacts/**", "**/storybook-static/**", "**/dist/**"],
      },
    };
    config.plugins = [
      ...(config.plugins ?? []),
      tailwindcss(),
      exampleSource(),
    ];
    return config;
  },
};
export default config;
