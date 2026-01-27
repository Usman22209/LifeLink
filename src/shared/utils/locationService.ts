import Geolocation from 'react-native-geolocation-service';
import { requestLocationPermission } from './permissions';

export interface Coords {
    latitude: number;
    longitude: number;
}

export const getCurrentLocation = async (): Promise<Coords | null> => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return null;

    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            position => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            error => {
                console.error('[LocationService] Error:', error);
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000,
            }
        );
    });
};
