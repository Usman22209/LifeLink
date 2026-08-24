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

/**
 * Matches a city and/or province from raw string (e.g. from Google Place address components)
 * to a corresponding record in cities.json.
 */
export const findCityRecord = (
  cityName?: string,
  provinceName?: string,
): { id: string; name: { en: string; ur: string }; province: string } | null => {
  if (!cityName && !provinceName) return null;

  const normCity = cityName ? normalizeCityStr(cityName).toLowerCase() : "";
  const normProvince = provinceName ? normalizeCityStr(provinceName).toLowerCase() : "";

  // 1. Try exact match on city name and province
  if (normCity) {
    const directMatch = CitiesData.cities.find((c) => {
      const matchCity =
        c.name.en.toLowerCase() === normCity ||
        c.name.ur === normCity ||
        c.id === normCity;
      if (!matchCity) return false;
      if (normProvince) {
        return (
          c.province.toLowerCase() === normProvince ||
          c.province.toLowerCase().includes(normProvince) ||
          normProvince.includes(c.province.toLowerCase())
        );
      }
      return true;
    });
    if (directMatch) return directMatch;

    // 2. Try substring / word match (e.g. "Lahore District" -> "Lahore", "Rawalpindi Cantt" -> "Rawalpindi")
    const subMatch = CitiesData.cities.find((c) => {
      const cityEn = c.name.en.toLowerCase();
      return (
        normCity.includes(cityEn) ||
        cityEn.includes(normCity) ||
        (normCity.length > 3 && normCity.startsWith(cityEn))
      );
    });
    if (subMatch) return subMatch;
  }

  return null;
};

export const getProvinceNameByCityId = getProvinceByCityId;
