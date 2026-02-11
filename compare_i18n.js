const fs = require("fs");

const arPath =
  "c:/Users/abdallah/Desktop/sub-coders/real-state/messages/ar.json";
const enPath =
  "c:/Users/abdallah/Desktop/sub-coders/real-state/messages/en.json";

const ar = JSON.parse(fs.readFileSync(arPath, "utf8"));
const en = JSON.parse(fs.readFileSync(enPath, "utf8"));

function getKeys(obj, prefix = "") {
  let keys = [];
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      keys = keys.concat(getKeys(obj[key], prefix + key + "."));
    } else {
      keys.push(prefix + key);
    }
  }
  return keys;
}

const arKeys = getKeys(ar);
const enKeys = getKeys(en);

const missingInEn = arKeys.filter((key) => !enKeys.includes(key));
const missingInAr = enKeys.filter((key) => !arKeys.includes(key));

const result = {
  missingInEn,
  missingInAr,
};

fs.writeFileSync("missing_keys.json", JSON.stringify(result, null, 2));
console.log("Comparison saved to missing_keys.json");
