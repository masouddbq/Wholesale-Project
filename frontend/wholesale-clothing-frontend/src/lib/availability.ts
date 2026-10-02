export type AvailabilityStatus = "in_stock" | "out_of_stock" | "limited";

export const AVAILABILITY_OPTIONS: {
  value: AvailabilityStatus;
  label: string;
}[] = [
  { value: "in_stock", label: "موجود" },
  { value: "out_of_stock", label: "ناموجود" },
  { value: "limited", label: "موجودی محدود" },
];

export const availabilityLabel = (status?: AvailabilityStatus) =>
  AVAILABILITY_OPTIONS.find((item) => item.value === status)?.label || "موجود";
