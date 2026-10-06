import { CreateApiKeyPreview } from "../../../studio/pattern-previews";
export default {
  Permissions: () => <CreateApiKeyPreview />,
  NameAndExpiry: () => <CreateApiKeyPreview permissions={false} />,
};
