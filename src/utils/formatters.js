export function parseNumericInput(value) {
  if (value === null || value === undefined || value === "") return null;
  const normalized = String(value).replace(/,/g, "").trim();
  if (normalized === "") return null;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

export function displayNumericInput(value) {
  if (value === null || value === undefined || value === "") return "";
  return String(value).replace(/,/g, "");
}

const MASS_PRODUCTS = /\b(beans?|peas?|lentils?|rice|maize|corn|flour|wheat|millet|sorghum|cassava|potato|sweet potato|groundnut|nuts?)\b/i;
const VOLUME_PRODUCTS = /\b(milk|water|juice|oil|cooking oil|sunflower oil|vegetable oil)\b/i;
const COUNT_PRODUCTS = /\b(egg|eggs|banana|bananas|mango|mangoes|orange|oranges|bread|loaf|loaves)\b/i;

export function allowedUnitsForProduct(productName) {
  if (MASS_PRODUCTS.test(productName || "")) return ["kg", "g", "tonne", "bag", "sack"];
  if (VOLUME_PRODUCTS.test(productName || "")) return ["l", "ml", "kg"];
  if (COUNT_PRODUCTS.test(productName || "")) return ["piece", "unit", "dozen", "crate", "kg", "g"];
  return ["kg", "g", "tonne", "piece", "unit", "dozen", "crate", "bag", "sack"];
}
