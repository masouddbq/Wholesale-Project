const toEnglishDigits = (value) =>
  String(value || "")
    .replace(/[۰-۹]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
    .replace(/[٠-٩]/g, (digit) => "٠١٢٣٤٥٦٧٨٩".indexOf(digit));

const normalizePhone = (value) => {
  let digits = toEnglishDigits(value).replace(/\D/g, "");

  if (digits.startsWith("0098")) {
    digits = digits.slice(4);
  } else if (digits.startsWith("98")) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("9") && digits.length === 10) {
    digits = `0${digits}`;
  }

  return digits;
};

const isMobilePhone = (value) => /^09\d{9}$/.test(normalizePhone(value));

module.exports = {
  normalizePhone,
  isMobilePhone,
};
