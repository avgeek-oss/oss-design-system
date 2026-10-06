import { useState } from "react";
import { TeamGeneralSettings } from "../../../src/patterns/team-settings/team-general-settings";

function NamePreview() {
  const [value, setValue] = useState("Avgeek");
  return (
    <div className="max-w-lg p-4">
      <TeamGeneralSettings
        value={value}
        onSave={async (name) => setValue(name)}
      />
    </div>
  );
}
function DetailsPreview() {
  const [value, setValue] = useState({
    name: "Avgeek",
    description: "Platform team",
  });
  return (
    <div className="max-w-lg p-4">
      <TeamGeneralSettings
        mode="details"
        value={value}
        onSave={async (next) => setValue(next)}
      />
    </div>
  );
}
export default {
  "Team name": <NamePreview />,
  "Name and description": <DetailsPreview />,
};
