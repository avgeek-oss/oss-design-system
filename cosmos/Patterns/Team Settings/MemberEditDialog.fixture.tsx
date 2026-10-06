import { MemberEditPreview } from "../../../studio/pattern-previews";
export default {
  IdentityAndRole: () => <MemberEditPreview />,
  RoleOnly: () => <MemberEditPreview mode="role-only" />,
};
