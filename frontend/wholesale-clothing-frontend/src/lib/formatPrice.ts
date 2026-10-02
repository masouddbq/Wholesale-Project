export const formatGroupedNumber = (value: string | number) => {
  const digits = String(value).replace(/[^\d]/g, "");

  if (!digits) {
    return "";
  }

  return Number(digits).toLocaleString("en-US");
};

export const parseGroupedNumber = (value: string) => {
  const digits = value.replace(/[^\d]/g, "");

  if (!digits) {
    return NaN;
  }

  return Number(digits);
};

export const formatMoney = (value: number) =>
  value.toLocaleString("fa-IR");
