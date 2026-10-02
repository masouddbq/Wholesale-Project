const fs = require("fs");
const path = require("path");
const { packModules } = require("./pack-vendor-modules");

const source = path.join(
  __dirname,
  "..",
  "frontend",
  "wholesale-clothing-frontend",
  "next-build"
);
const destination = path.join(__dirname, "..", "prebuilt-next");
const skip = new Set(["cache", "dev", "trace", "diagnostics"]);

if (!fs.existsSync(source)) {
  console.error("next-build folder not found. Run the frontend build first.");
  process.exit(1);
}

fs.rmSync(destination, { recursive: true, force: true });
fs.cpSync(source, destination, {
  recursive: true,
  filter: (src) => {
    const rel = path.relative(source, src);
    const parts = rel.split(path.sep);
    if (skip.has(parts[0])) {
      return false;
    }
    if (parts.includes("node_modules") || parts.includes("vendor-modules")) {
      return false;
    }
    return true;
  },
});

const standaloneModules = path.join(source, "standalone", "node_modules");
const standaloneVendorDir = path.join(source, "standalone", "vendor-modules");
const standalonePackFrom = fs.existsSync(standaloneModules)
  ? standaloneModules
  : standaloneVendorDir;

packModules(
  standalonePackFrom,
  path.join(destination, "standalone", "vendor-modules.tgz")
);

packModules(
  path.join(__dirname, "..", "backend", "node_modules"),
  path.join(__dirname, "..", "backend", "vendor-modules.tgz")
);

console.log("Copied production build and packed vendor modules");
