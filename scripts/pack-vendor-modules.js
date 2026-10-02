const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const tarBin =
  process.platform === "win32" ? "C:\\Windows\\System32\\tar.exe" : "tar";

function packModules(modulesDir, archivePath) {
  if (!fs.existsSync(modulesDir)) {
    console.error("Missing modules folder:", modulesDir);
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(archivePath), { recursive: true });
  fs.rmSync(archivePath, { force: true });
  const packed = spawnSync(
    tarBin,
    ["-czf", archivePath, "--exclude=am-clothing", "-C", modulesDir, "."],
    { stdio: "inherit" }
  );
  if (packed.status !== 0) {
    console.error("Failed to pack", archivePath);
    process.exit(packed.status || 1);
  }
  console.log("Packed", archivePath);
}

module.exports = { tarBin, packModules };
