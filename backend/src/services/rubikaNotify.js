const RubikaContact = require("../models/RubikaContact");
const User = require("../models/User");
const { normalizePhone } = require("../lib/phone");
const { VALID_TRANSITIONS } = require("./orderStatusService");
const { isRubikaConfigured, sendMessage } = require("./rubikaClient");

const STATUS_LABELS = {
  pending: "در انتظار تأیید",
  confirmed: "تأیید شده",
  preparing: "در حال آماده‌سازی",
  shipped: "ارسال شده",
  completed: "تکمیل شده",
  cancelled: "لغو شده",
};

const STATUS_BUTTONS = {
  confirmed: "تأیید سفارش",
  preparing: "در حال آماده‌سازی",
  shipped: "ارسال شد",
  completed: "تکمیل شد",
  cancelled: "لغو شده",
};

const BUTTON_TEXT_TO_STATUS = Object.fromEntries(
  Object.entries(STATUS_BUTTONS).map(([status, label]) => [label, status]),
);

const formatMoney = (amount) =>
  `${new Intl.NumberFormat("fa-IR").format(amount || 0)} تومان`;

const envAdminPhones = () => {
  const values = [process.env.ADMIN_PHONE, process.env.RUBIKA_ADMIN_PHONES]
    .filter(Boolean)
    .join(",")
    .split(/[,\n\s]+/)
    .map((item) => normalizePhone(item))
    .filter((item) => item.length >= 10);

  return new Set(values);
};

const envAdminChatIds = () =>
  (process.env.RUBIKA_ADMIN_CHAT_IDS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const collectAdminPhones = async () => {
  const phones = envAdminPhones();
  const admins = await User.find({ role: "admin" }).select("phone");

  for (const admin of admins) {
    const phone = normalizePhone(admin.phone);
    if (phone) {
      phones.add(phone);
    }
  }

  return phones;
};

const contactMatchesAdmin = (contact, adminPhones) => {
  const phone = normalizePhone(contact.phone);
  return Boolean(phone) && adminPhones.has(phone);
};

const syncAdminContacts = async () => {
  const adminPhones = await collectAdminPhones();
  const contacts = await RubikaContact.find();

  await Promise.all(
    contacts.map(async (contact) => {
      const shouldBeAdmin = contactMatchesAdmin(contact, adminPhones);
    const nextRole = shouldBeAdmin ? "admin" : "customer";

    if (contact.role !== nextRole) {
      contact.role = nextRole;
      contact.phone = normalizePhone(contact.phone) || contact.phone;
      await contact.save();
    }
    }),
  );

  return adminPhones;
};

const isAdminPhone = async (phone) => {
  const normalized = normalizePhone(phone);

  if (!normalized) {
    return false;
  }

  const adminPhones = await collectAdminPhones();
  return adminPhones.has(normalized);
};

const isAdminChat = async (chatId) => {
  if (envAdminChatIds().includes(String(chatId))) {
    return true;
  }

  const contact = await RubikaContact.findOne({ chatId: String(chatId) });

  if (!contact) {
    return false;
  }

  if (contact.role === "admin") {
    return true;
  }

  return isAdminPhone(contact.phone);
};

const getAdminChatIds = async () => {
  await syncAdminContacts();

  const fromDb = await RubikaContact.find({ role: "admin" }).select("chatId");
  return [...new Set([...envAdminChatIds(), ...fromDb.map((item) => item.chatId)])];
};

const rememberAdminOrder = async (orderId) => {
  await RubikaContact.updateMany(
    { role: "admin" },
    { $set: { lastOrderId: orderId } },
  );
};

const buildOrderText = (order, headline) => {
  const address = [
    order.customer?.province,
    order.customer?.city,
    order.customer?.address,
    order.customer?.postalCode,
  ]
    .filter(Boolean)
    .join("، ");

  const lines = [
    headline,
    `شماره سفارش: ${order.orderNumber}`,
    `وضعیت فعلی: ${STATUS_LABELS[order.status] || order.status}`,
    `مشتری: ${order.customer?.name || "—"}`,
    `موبایل: ${order.customer?.phone || "—"}`,
    `آدرس: ${address || "—"}`,
    `مبلغ: ${formatMoney(order.totalAmount)}`,
    "",
    "اقلام:",
  ];

  for (const item of order.items || []) {
    const extra = [item.color, item.size].filter(Boolean).join(" / ");
    lines.push(
      `• ${item.name}${extra ? ` (${extra})` : ""} × ${item.quantity}`,
    );
  }

  if (order.note) {
    lines.push("", `یادداشت: ${order.note}`);
  }

  lines.push("", "با دکمه‌های زیر وضعیت را مشخص کنید.");

  return lines.join("\n");
};

const statusKeypad = (order) => {
  const next = VALID_TRANSITIONS[order.status] || [];

  if (next.length === 0) {
    return null;
  }

  const rows = [];
  const primary = next.filter((status) =>
    ["confirmed", "preparing", "cancelled"].includes(status),
  );
  const extra = next.filter(
    (status) => !["confirmed", "preparing", "cancelled"].includes(status),
  );

  for (const status of [...primary, ...extra]) {
    rows.push({
      buttons: [
        {
          id: `st:${order._id}:${status}`,
          type: "Simple",
          button_text: STATUS_BUTTONS[status] || status,
        },
      ],
    });
  }

  return { rows };
};

const notifyAdmins = async (order, headline) => {
  if (!isRubikaConfigured()) {
    return;
  }

  const chatIds = await getAdminChatIds();

  if (chatIds.length === 0) {
    console.warn("Rubika: no admin chat linked yet");
    return;
  }

  await rememberAdminOrder(order._id);

  const text = buildOrderText(order, headline);
  const keypad = statusKeypad(order);

  await Promise.all(
    chatIds.map((chatId) => sendMessage(chatId, text, keypad)),
  );
};

const notifyAdminsNewOrder = (order) =>
  notifyAdmins(order, "سفارش جدید ثبت شد");

const notifyAdminsStatus = (order) =>
  notifyAdmins(
    order,
    `وضعیت سفارش به‌روز شد: ${STATUS_LABELS[order.status] || order.status}`,
  );

const notifyCustomerStatus = async (order) => {
  if (!isRubikaConfigured()) {
    return;
  }

  const phone = normalizePhone(order.customer?.phone);

  if (!phone) {
    return;
  }

  const contact = await RubikaContact.findOne({
    $or: [{ phone }, { phone: order.customer?.phone }],
    role: { $ne: "admin" },
  });

  if (!contact) {
    return;
  }

  const text = [
    `سفارش ${order.orderNumber}`,
    `وضعیت سفارش شما: ${STATUS_LABELS[order.status] || order.status}`,
    `مبلغ: ${formatMoney(order.totalAmount)}`,
    "در صورت نیاز با فروشگاه تماس بگیرید.",
  ].join("\n");

  await sendMessage(contact.chatId, text);
};

const findAdminUserId = async (chatId) => {
  const contact = await RubikaContact.findOne({ chatId: String(chatId) });
  const phone = contact?.phone || [...envAdminPhones()][0];

  if (!phone) {
    return null;
  }

  const admins = await User.find({ role: "admin" }).select("phone");
  const admin = admins.find(
    (item) => normalizePhone(item.phone) === normalizePhone(phone),
  );

  return admin?._id || null;
};

module.exports = {
  STATUS_LABELS,
  STATUS_BUTTONS,
  BUTTON_TEXT_TO_STATUS,
  isAdminPhone,
  isAdminChat,
  notifyAdminsNewOrder,
  notifyAdminsStatus,
  notifyCustomerStatus,
  findAdminUserId,
};
