import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";
addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "OSS Design System",
    fontBase: '"Inter Variable", sans-serif',
  }),
});
