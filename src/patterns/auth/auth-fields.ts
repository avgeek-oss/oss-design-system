import type { AuthField } from "./auth-form.js";

export const emailField: AuthField = {
  name: "email",
  label: "Email",
  type: "email",
  required: true,
  autoComplete: "email",
};

export const currentPasswordField: AuthField = {
  name: "password",
  label: "Password",
  type: "password",
  required: true,
  minLength: 1,
  autoComplete: "current-password",
};
