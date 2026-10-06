import { z } from "zod";

/** Legacy role vocabulary; use invitationSchema for standard team roles. */
export const memberRoleSchema = z.enum(["admin", "member", "editor", "viewer"]);
export const createInvitationSchema = <T extends string>(
  roles: readonly [T, ...T[]],
) => z.object({ email: emailSchema, role: z.enum(roles) }).strict();
export type MemberRole = z.infer<typeof memberRoleSchema>;

// Common identity and team names use 120; domain-specific forms may set a limit.
export const createNameSchema = (maxLength = 120) =>
  z.string().trim().min(1, "Enter a name").max(maxLength);
export const emailSchema = z.email().max(320);
export const createProfileSchema = (maxLength = 120) =>
  z.object({ displayName: createNameSchema(maxLength) }).strict();
export const createTeamSchema = (maxLength = 120) =>
  z.object({ name: createNameSchema(maxLength) }).strict();
export const invitationSchema = createInvitationSchema([
  "admin",
  "member",
  "viewer",
]);
