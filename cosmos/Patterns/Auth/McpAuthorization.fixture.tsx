import { ConsentPreview } from "../../../studio/auth-previews";

export default {
  Administrator: <ConsentPreview />,
  Viewer: <ConsentPreview viewerRole />,
  Pending: <ConsentPreview slowRequest />,
};
