import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import Video from "react-native-video";
import { splash } from "@assets/videos";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { UserStackParamList } from "types/navigation";
import { ROUTES } from "@utils/Routes";
import { ThemeContext } from "@providers/ThemeProvider";
import ScreenWrapper from "@components/ScreenWrapper";

type SplashScreenNavigationProp = StackNavigationProp<
    UserStackParamList,
    typeof ROUTES.SPLASH
>;

const SplashScreen = () => {
    const navigation = useNavigation<SplashScreenNavigationProp>();
    const theme = useContext(ThemeContext);

    const handleEnd = () => {
        navigation.replace(ROUTES.AUTH_FLOW);
    };

    return (
        <ScreenWrapper
            scrollable={false}
            showNetworkBanner={false}
            backgroundColor={theme.background}
        >
            <Video
                source={splash}
                style={styles.video}
                resizeMode="contain"
                repeat={false}
                onEnd={handleEnd}
                playInBackground={false}
                playWhenInactive={false}
            />
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    video: {
        flex: 1,
    },
});

export default SplashScreen;
