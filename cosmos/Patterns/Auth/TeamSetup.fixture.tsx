import { useRef } from "react";
import { AuthPreview, authPreviewBrand } from "../../../studio/auth-previews";
import { preferenceOptions } from "../../../studio/preference-options";
import { TeamSetup } from "../../../src/patterns/auth/team-setup";
import { toast } from "../../../src/overlays/toast";

function SecretRetry() {
  const attempts = useRef(0);
  return (
    <TeamSetup
      brand={authPreviewBrand}
      preferenceOptions={preferenceOptions}
      onSubmit={async (values) => {
        attempts.current++;
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (attempts.current === 1)
          throw new Error("The installation setup secret is incorrect");
        toast.success(`Setup completed for ${values.team}`);
      }}
    />
  );
}
export default {
  Default: <AuthPreview initial="TeamSetup" />,
  "Secret retry": <SecretRetry />,
};
