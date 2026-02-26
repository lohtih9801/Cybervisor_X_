const fs = require("fs");
const path = require("path");

const filePath = path.join(
  __dirname,
  "cti-master/enterprise-attack/enterprise-attack.json"
);

const raw = fs.readFileSync(filePath, "utf8");
const bundle = JSON.parse(raw);

let grouped = {};

bundle.objects.forEach(obj => {

  if (
    obj.type === "attack-pattern" &&
    !obj.x_mitre_deprecated &&
    obj.kill_chain_phases
  ) {

    const technique = {
      id: obj.external_references?.[0]?.external_id || obj.id,
      name: obj.name
    };

    obj.kill_chain_phases.forEach(phase => {

      if (!grouped[phase.phase_name]) {
        grouped[phase.phase_name] = [];
      }

      grouped[phase.phase_name].push(technique);
    });

  }

});

const finalData = Object.keys(grouped).map(tactic => ({
  tactic,
  techniques: grouped[tactic]
}));

fs.writeFileSync(
  path.join(__dirname, "public/matrix-data.json"),
  JSON.stringify(finalData, null, 2)
);

console.log("✅ Matrix rebuilt using enterprise-attack.json");