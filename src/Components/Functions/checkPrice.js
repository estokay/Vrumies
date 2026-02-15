export default function checkPrice(rawPrice) {
  if (rawPrice === undefined || rawPrice === null) return 0;
  if (typeof rawPrice === "number") return rawPrice;
  if (typeof rawPrice === "string") {
    const parsed = parseFloat(rawPrice.replace(/[^0-9.]/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}