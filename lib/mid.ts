export function formatMid(value: number): string {
  if (!Number.isInteger(value) || value < 1 || value > 9999999)
    throw new Error("MID ngoài phạm vi.");
  return String(value).padStart(7, "0");
}
