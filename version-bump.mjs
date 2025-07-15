import { readFileSync, writeFileSync } from "fs";

const targetVersion = JSON.parse(readFileSync("package.json", "utf8")).version;
// read minAppVersion from manifest.json and bump version to target version
let manifest = JSON.parse(readFileSync("public/manifest.json", "utf8"));
const { minAppVersion } = manifest;
manifest.version = targetVersion;
writeFileSync("public/manifest.json", JSON.stringify(manifest, null, "\t"));

// update versions.json with target version and minAppVersion from manifest.json
let versions = JSON.parse(readFileSync("public/versions.json", "utf8"));
versions[targetVersion] = minAppVersion;
writeFileSync("public/versions.json", JSON.stringify(versions, null, "\t"));