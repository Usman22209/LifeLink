import CitiesData from "@shared/data/cities.json";

export interface CityDetails {
    name: string;
    province: string;
}

export const getCityDetails = (cityId: string, lang: 'en' | 'ur' = 'en'): CityDetails | null => {
    const city = CitiesData.cities.find(c => c.id === cityId);
    if (!city) return null;
    return {
        name: city.name[lang] || city.name.en,
        province: city.province
    };
};
