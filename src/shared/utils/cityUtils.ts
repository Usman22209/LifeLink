import CitiesData from "@shared/data/cities.json";

/**
 * Resolves a city ID (e.g. "13406360" or "city_lahore") or city name to a human-readable city name.
 */
const normalizeCityStr = (str: string): string => {
  return str
    .replace(/^city_/i, "")
    .replace(/_/g, " ")
    .trim();
};

const capitalizeWords = (str: string): string => {
  return str
    .split(" ")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ""))
    .join(" ");
};

/**
 * Resolves a city ID (e.g. "13406360" or "city_lahore") or city name to a human-readable city name.
 */
export const getCityNameById = (
  cityIdOrName?: string,
  lang: string = "en",
): string => {
  if (!cityIdOrName || cityIdOrName === "N/A" || cityIdOrName === "undefined") return "";
  const rawStr = String(cityIdOrName).trim();
  if (rawStr === "N/A" || rawStr === "undefined") return "";

  const normalized = normalizeCityStr(rawStr).toLowerCase();

  const city = CitiesData.cities.find(
    (c) =>
      c.id === rawStr ||
      c.id === normalized ||
      c.name.en.toLowerCase() === normalized ||
      c.name.en.toLowerCase() === rawStr.toLowerCase() ||
      c.name.ur === rawStr,
  );

  if (city) {
    const l = lang === "ur" ? "ur" : "en";
    return city.name[l] || city.name.en || capitalizeWords(normalized);
  }

  return capitalizeWords(normalized);
};

/**
 * Resolves state/province name from a city ID or city name.
 */
export const getProvinceByCityId = (cityIdOrName?: string): string => {
  if (!cityIdOrName || cityIdOrName === "N/A" || cityIdOrName === "undefined") return "";
  const rawStr = String(cityIdOrName).trim();
  if (rawStr === "N/A" || rawStr === "undefined") return "";

  const normalized = normalizeCityStr(rawStr).toLowerCase();

  const city = CitiesData.cities.find(
    (c) =>
      c.id === rawStr ||
      c.id === normalized ||
      c.name.en.toLowerCase() === normalized ||
      c.name.en.toLowerCase() === rawStr.toLowerCase() ||
      c.name.ur === rawStr,
  );

  return city?.province || "";
};

export const getProvinceNameByCityId = getProvinceByCityId;
