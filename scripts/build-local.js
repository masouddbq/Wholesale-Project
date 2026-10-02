const { spawnSync } = require("child_process");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const env = {
  ...process.env,
  NEXT_PUBLIC_API_URL: "same",
};

const build = spawnSync(
  "npm",
  ["run", "build", "--prefix", "frontend/wholesale-clothing-frontend"],
  {
    cwd: rootDir,
    env,
    stdio: "inherit",
    shell: true,
  }
);

if (build.status !== 0) {
  process.exit(build.status || 1);
}

const copy = spawnSync("node", ["scripts/copy-prebuilt-next.js"], {
  cwd: rootDir,
  env,
  stdio: "inherit",
  shell: true,
});

process.exit(copy.status || 0);
