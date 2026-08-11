import React from "react";
import Geolocation from "react-native-geolocation-service";
import {
  checkLocationPermission,
  requestLocationPermission,
} from "./permissions";

export interface Coords {
  latitude: number;
  longitude: number;
}

export const getCurrentLocation = async (
  shouldRequestPermission = false,
): Promise<Coords | null> => {
  try {
    const hasPermission = shouldRequestPermission
      ? await requestLocationPermission()
      : await checkLocationPermission();

    if (!hasPermission) return null;

    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          // Fallback attempt with cached / network location if GPS provider times out
          Geolocation.getCurrentPosition(
            (fallbackPos) => {
              resolve({
                latitude: fallbackPos.coords.latitude,
                longitude: fallbackPos.coords.longitude,
              });
            },
            () => {
              // Gracefully return null without spamming warning logs
              resolve(null);
            },
            {
              enableHighAccuracy: false,
              timeout: 15000,
              maximumAge: 300000, // 5 minute cached location fallback
            },
          );
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60000,
        },
      );
    });
  } catch (err) {
    return null;
  }
};

/**
 * Calculates straight-line distance in kilometers between two GPS coordinates using Haversine formula.
 */
export const calculateDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Earth radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

/**
 * Formats distance into human-readable string (e.g., "3.2 km" or "450 m").
 */
export const formatDistance = (
  userCoords?: { latitude?: number; longitude?: number } | null,
  targetCoords?: { latitude?: number; longitude?: number } | null,
): string => {
  if (
    !userCoords?.latitude ||
    !userCoords?.longitude ||
    !targetCoords?.latitude ||
    !targetCoords?.longitude
  ) {
    return "";
  }
  const km = calculateDistanceKm(
    userCoords.latitude,
    userCoords.longitude,
    targetCoords.latitude,
    targetCoords.longitude,
  );
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km} km`;
};

/**
 * Hook to automatically resolve user location (Redux profile coords or silent GPS)
 */
export const useUserLocation = (): Coords | null => {
  const [coords, setCoords] = React.useState<Coords | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    getCurrentLocation(false).then((loc) => {
      if (isMounted && loc) {
        setCoords(loc);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return coords;
};
