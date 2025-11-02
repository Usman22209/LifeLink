import React from 'react';
import { View, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import { splash } from '@assets/videos';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { UserStackParamList } from 'types/navigation';
import { ROUTES } from '@utils/Routes';
import ThemeProvider from '@shared/providers/ThemeProvider';
type SplashScreenNavigationProp = StackNavigationProp<UserStackParamList, typeof ROUTES.SPLASH>;

export default function SplashScreen() {
    const navigation = useNavigation<SplashScreenNavigationProp>();

    const handleEnd = () => {
        navigation.replace(ROUTES.AUTH_FLOW);
    };

    return (
        <View style={styles.container}>
            <Video
                source={splash}
                style={styles.video}
                resizeMode="contain"
                repeat={false}
                onEnd={handleEnd}
                playInBackground={false}
                playWhenInactive={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    video: { flex: 1 },
});
