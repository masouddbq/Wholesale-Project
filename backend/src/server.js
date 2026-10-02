try {
  require("dotenv").config();
} catch {
  // Chabokan injects env vars; dotenv is only needed for local .env files.
}

const app = require("./app");
const connectDB = require("./config/db");
const ensureAdmin = require("../ensureAdmin");

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

const { registerWebhook, startPolling } = require("./services/rubikaClient");
const { processRubikaEvent } = require("./controllers/rubikaController");

const startServer = async () => {
  await connectDB();
  await ensureAdmin();

  app.listen(PORT, HOST, () => {
    console.log(`Server running on ${HOST}:${PORT}`);
    registerWebhook().catch((error) => {
      console.error("Rubika webhook register failed", error);
    });
    startPolling(processRubikaEvent);
  });
};

startServer();