const RUBIKA_API = "https://botapi.rubika.ir/v3";

const getToken = () =>
  (process.env.RUBIKA_BOT_TOKEN || "")
    .trim()
    .replace(/^["']+|["']+$/g, "");

const isRubikaConfigured = () => Boolean(getToken());

const unwrap = (payload) => {
  if (!payload || typeof payload !== "object") {
    return payload;
  }

  const status = String(payload.status || payload.ok || "").toUpperCase();

  if (status && status !== "OK" && status !== "TRUE" && payload.ok !== true) {
    console.error("Rubika API status", payload.status || payload.ok, payload);
  }

  return payload.data || payload;
};

const callRubika = async (method, payload = {}) => {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(
      `${RUBIKA_API}/${encodeURIComponent(token)}/${method}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error(`Rubika ${method} HTTP ${response.status}`, data);
      return null;
    }

    return unwrap(data);
  } catch (error) {
    console.error(`Rubika ${method} network error`, error);
    return null;
  }
};

const sendMessage = async (chatId, text, keypad) => {
  if (!chatId || !text) {
    return null;
  }

  const payload = {
    chat_id: String(chatId),
    text,
  };

  if (keypad) {
    payload.inline_keypad = keypad;
    payload.chat_keypad = {
      ...keypad,
      resize_keyboard: true,
      one_time_keyboard: false,
    };
    payload.chat_keypad_type = "New";
  }

  const result = await callRubika("sendMessage", payload);

  if (!result) {
    console.error("Rubika sendMessage returned empty", { chatId });
  }

  return result;
};

const registerWebhook = async () => {
  if (!isRubikaConfigured()) {
    console.warn("Rubika token is missing; bot will stay silent");
    return;
  }

  const publicUrl = (
    process.env.RUBIKA_WEBHOOK_URL ||
    process.env.FRONTEND_URL ||
    "https://amclothing.ir"
  ).replace(/\/$/, "");

  if (!publicUrl.startsWith("https://")) {
    console.warn("Rubika webhook skipped: HTTPS public URL is required");
    return;
  }

  const url = `${publicUrl}/api/rubika/webhook`;

  await callRubika("updateBotEndpoints", {
    url,
    type: "ReceiveUpdate",
  });
  await callRubika("updateBotEndpoints", {
    url,
    type: "ReceiveInlineMessage",
  });

  console.log("Rubika webhook registered", url);
};

const startPolling = (onEvent) => {
  if (!isRubikaConfigured()) {
    return;
  }

  let offsetId = "";
  let inFlight = false;

  const tick = async () => {
    if (inFlight) {
      return;
    }

    inFlight = true;

    try {
      const payload = {
        limit: 100,
      };

      if (offsetId) {
        payload.offset_id = offsetId;
      }

      const result = await callRubika("getUpdates", payload);
      const updates = result?.updates || [];

      if (result?.next_offset_id) {
        offsetId = result.next_offset_id;
      }

      for (const update of updates) {
        await onEvent({ update });
      }
    } catch (error) {
      console.error("Rubika polling error", error);
    } finally {
      inFlight = false;
    }
  };

  tick();
  setInterval(tick, 4000);
  console.log("Rubika getUpdates polling started");
};

module.exports = {
  isRubikaConfigured,
  callRubika,
  sendMessage,
  registerWebhook,
  startPolling,
};
