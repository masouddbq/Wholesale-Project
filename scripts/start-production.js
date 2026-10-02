const { spawn, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const backendDir = path.join(rootDir, "backend");
const frontendDir = path.join(
  rootDir,
  "frontend",
  "wholesale-clothing-frontend"
);

const frontendPort = process.env.PORT || "3000";
const backendPort = process.env.BACKEND_PORT || "5001";
const internalApiUrl =
  process.env.INTERNAL_API_URL || `http://127.0.0.1:${backendPort}`;

const prebuiltDir = path.join(rootDir, "prebuilt-next");
const nextBuildDir = path.join(frontendDir, "next-build");

function hasModule(pkgDir, moduleName) {
  return fs.existsSync(path.join(pkgDir, "node_modules", moduleName));
}

function restoreVendorModules(parentDir) {
  const archive = path.join(parentDir, "vendor-modules.tgz");
  const vendorDir = path.join(parentDir, "vendor-modules");
  const modulesDir = path.join(parentDir, "node_modules");

  if (fs.existsSync(archive)) {
    fs.rmSync(modulesDir, { recursive: true, force: true });
    fs.mkdirSync(modulesDir, { recursive: true });
    const unpacked = spawnSync("tar", ["-xzf", archive, "-C", modulesDir], {
      stdio: "inherit",
    });
    if (unpacked.status !== 0) {
      console.error("Failed to unpack", archive);
      process.exit(unpacked.status || 1);
    }
    return;
  }

  if (!fs.existsSync(vendorDir)) {
    return;
  }
  fs.rmSync(modulesDir, { recursive: true, force: true });
  fs.cpSync(vendorDir, modulesDir, { recursive: true });
}

restoreVendorModules(backendDir);

if (!hasModule(backendDir, "express") && !hasModule(rootDir, "express")) {
  console.error(
    "backend/vendor-modules.tgz is missing from the upload. Run npm run build:local then chabok deploy from the repo root."
  );
  process.exit(1);
}

if (!fs.existsSync(prebuiltDir)) {
  console.error("prebuilt-next is missing. Run npm run build:local before deploy.");
  process.exit(1);
}

fs.rmSync(nextBuildDir, { recursive: true, force: true });
fs.cpSync(prebuiltDir, nextBuildDir, { recursive: true });
restoreVendorModules(path.join(nextBuildDir, "standalone"));
console.log("Restored Next.js build from prebuilt-next");

function findStandaloneServer() {
  const candidates = [
    path.join(nextBuildDir, "standalone", "server.js"),
    path.join(
      nextBuildDir,
      "standalone",
      "frontend",
      "wholesale-clothing-frontend",
      "server.js"
    ),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate));
}

function hydrateStandalone(serverFile) {
  const standaloneRoot = path.join(nextBuildDir, "standalone");
  const serverDir = path.dirname(serverFile);
  const staticSrc = path.join(nextBuildDir, "static");
  const publicSrc = path.join(frontendDir, "public");
  const staticDests = [
    path.join(serverDir, "next-build", "static"),
    path.join(standaloneRoot, "next-build", "static"),
    path.join(serverDir, ".next", "static"),
  ];

  if (fs.existsSync(staticSrc)) {
    for (const dest of staticDests) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.cpSync(staticSrc, dest, { recursive: true });
    }
  }

  if (fs.existsSync(publicSrc)) {
    fs.cpSync(publicSrc, path.join(serverDir, "public"), { recursive: true });
  }
}

const standaloneServer = findStandaloneServer();

if (!standaloneServer) {
  console.error(
    "prebuilt-next/standalone/server.js is missing. Run npm run build:local before deploy."
  );
  process.exit(1);
}

hydrateStandalone(standaloneServer);
console.log("Starting Next.js standalone server");

function startProcess(name, command, args, cwd, extraEnv) {
  const child = spawn(command, args, {
    cwd,
    env: {
      ...process.env,
      ...extraEnv,
    },
    stdio: "inherit",
  });

  child.on("exit", (code) => {
    console.error(`${name} stopped with code ${code}`);
    process.exit(code || 1);
  });

  child.on("error", (error) => {
    console.error(`${name} failed to start`, error);
    process.exit(1);
  });

  return child;
}

startProcess("backend", process.execPath, ["src/server.js"], backendDir, {
  PORT: backendPort,
  HOST: "127.0.0.1",
  COMBINED_HOST: "true",
});

startProcess(
  "frontend",
  process.execPath,
  [standaloneServer],
  path.dirname(standaloneServer),
  {
    PORT: frontendPort,
    HOST: "0.0.0.0",
    HOSTNAME: "0.0.0.0",
    COMBINED_HOST: "true",
    INTERNAL_API_URL: internalApiUrl,
    BACKEND_PORT: backendPort,
  }
);

console.log(
  `Combined host: site on ${frontendPort}, api on ${backendPort}`
);
