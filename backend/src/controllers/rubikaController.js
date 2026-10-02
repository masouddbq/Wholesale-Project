const RubikaContact = require("../models/RubikaContact");
const { normalizePhone, isMobilePhone } = require("../lib/phone");
const { applyOrderStatusChange } = require("../services/orderStatusService");
const { sendMessage } = require("../services/rubikaClient");
const {
  BUTTON_TEXT_TO_STATUS,
  isAdminPhone,
  isAdminChat,
  notifyAdminsStatus,
  notifyCustomerStatus,
  findAdminUserId,
} = require("../services/rubikaNotify");

const welcomeCustomer =
  "سلام، به بات فروشگاه AM Clothing وصل شدید.\nهمان شماره موبایلی که در سایت ثبت می‌کنید را همین‌جا بفرستید تا وضعیت سفارش برایتان ارسال شود.";

const welcomeAdmin =
  "شماره ادمین ثبت شد.\nاز این به بعد سفارش‌های جدید با جزئیات و دکمه‌های تأیید، آماده‌سازی و لغو در همین چت می‌آید.";

const unwrapBody = (body = {}) => {
  if (!body || typeof body !== "object") {
    return {};
  }

  if (body.update || body.inline_message) {
    return body;
  }

  if (body.data && typeof body.data === "object") {
    return unwrapBody(body.data);
  }

  return body;
};

const extractEvent = (raw = {}) => {
  const body = unwrapBody(raw);

  if (body.inline_message) {
    return {
      chatId: body.inline_message.chat_id,
      text: body.inline_message.text || "",
      buttonId: body.inline_message.aux_data?.button_id || "",
    };
  }

  const update = body.update || body;
  const message = update.new_message || update.message || {};

  return {
    chatId:
      update.chat_id ||
      message.chat_id ||
      message.sender_id ||
      update.sender_id,
    text: message.text || update.text || "",
    buttonId:
      message.aux_data?.button_id || update.aux_data?.button_id || "",
    started: update.type === "StartedBot",
    eventId:
      message.message_id ||
      update.message_id ||
      `${update.chat_id || ""}:${update.time || Date.now()}`,
  };
};

const parseStatusCommand = (buttonId, text) => {
  const fromId = String(buttonId || "").match(/^st:([a-f0-9]{24}):([a-z]+)$/i);

  if (fromId) {
    return { orderId: fromId[1], status: fromId[2] };
  }

  const fromTextId = String(text || "").match(/^st:([a-f0-9]{24}):([a-z]+)$/i);

  if (fromTextId) {
    return { orderId: fromTextId[1], status: fromTextId[2] };
  }

  const status = BUTTON_TEXT_TO_STATUS[String(text || "").trim()];

  if (status) {
    return { orderId: null, status };
  }

  return null;
};

const linkPhone = async (chatId, rawPhone) => {
  const phone = normalizePhone(rawPhone);
  const role = (await isAdminPhone(phone)) ? "admin" : "customer";

  await RubikaContact.deleteMany({
    phone,
    chatId: { $ne: String(chatId) },
  });

  await RubikaContact.findOneAndUpdate(
    { chatId: String(chatId) },
    {
      chatId: String(chatId),
      phone,
      role,
    },
    { upsert: true, new: true, runValidators: true },
  );

  return role === "admin" ? welcomeAdmin : "شماره شما ثبت شد. وقتی وضعیت سفارش عوض شود، پیامش را در همین چت می‌گیرید.";
};

const applyAdminStatus = async (chatId, orderId, status) => {
  if (!(await isAdminChat(chatId))) {
    await sendMessage(chatId, "فقط ادمین می‌تواند وضعیت سفارش را عوض کند.");
    return;
  }

  let targetOrderId = orderId;

  if (!targetOrderId) {
    const contact = await RubikaContact.findOne({ chatId: String(chatId) });
    targetOrderId = contact?.lastOrderId;
  }

  if (!targetOrderId) {
    await sendMessage(chatId, "سفارشی برای تغییر وضعیت پیدا نشد.");
    return;
  }

  const changedByUserId = await findAdminUserId(chatId);
  const result = await applyOrderStatusChange({
    orderId: targetOrderId,
    status,
    changedByUserId,
  });

  if (!result.ok) {
    await sendMessage(chatId, result.message || "تغییر وضعیت انجام نشد.");
    return;
  }

  await notifyCustomerStatus(result.order);
  await notifyAdminsStatus(result.order);
};

const seenEvents = new Set();

const processRubikaEvent = async (body) => {
  const event = extractEvent(body);

  if (!event.chatId) {
    if (body && Object.keys(body).length > 0) {
      console.warn("Rubika event without chat_id", Object.keys(body));
    }
    return;
  }

  const eventKey = `${event.chatId}:${event.eventId || event.buttonId || event.text}`;

  if (seenEvents.has(eventKey)) {
    return;
  }

  seenEvents.add(eventKey);

  if (seenEvents.size > 500) {
    seenEvents.clear();
  }

  const statusCommand = parseStatusCommand(event.buttonId, event.text);

  if (statusCommand?.status) {
    await applyAdminStatus(
      event.chatId,
      statusCommand.orderId,
      statusCommand.status,
    );
    return;
  }

  const text = String(event.text || "").trim();

  if (event.started || !text) {
    await sendMessage(event.chatId, welcomeCustomer);
    return;
  }

  if (isMobilePhone(text)) {
    const reply = await linkPhone(event.chatId, text);
    await sendMessage(event.chatId, reply);
    return;
  }

  const existing = await RubikaContact.findOne({
    chatId: String(event.chatId),
  });

  if (existing) {
    await sendMessage(
      event.chatId,
      existing.role === "admin"
        ? "شما به‌عنوان ادمین وصل هستید. سفارش‌های جدید همین‌جا می‌آید."
        : `شماره ${existing.phone} قبلاً ثبت شده است.`,
    );
    return;
  }

  await sendMessage(event.chatId, welcomeCustomer);
};

const handleRubikaWebhook = async (req, res) => {
  res.status(200).json({ ok: true });

  processRubikaEvent(req.body).catch((error) => {
    console.error("Rubika webhook error", error);
  });
};

module.exports = {
  handleRubikaWebhook,
  processRubikaEvent,
};
