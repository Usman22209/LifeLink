import { PermissionsAndroid, Platform } from 'react-native';

export const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        if (granted) return true;

        const result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        return result === PermissionsAndroid.RESULTS.GRANTED;
    }

    return true; // iOS permissions are handled via Info.plist and system prompts
};
