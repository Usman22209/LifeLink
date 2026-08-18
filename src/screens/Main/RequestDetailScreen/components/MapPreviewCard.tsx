import React from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { moderateScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { styles } from "../RequestDetailScreen.styles";

interface MapPreviewCardProps {
  request: any;
  mapOverlayText: string;
  onNavigate: () => void;
}

export const MapPreviewCard: React.FC<MapPreviewCardProps> = ({
  request,
  mapOverlayText,
  onNavigate,
}) => {
  if (Platform.OS === "ios") {
    return null;
  }

  const lat = Number(request?.latitude) || 31.5723;
  const lng = Number(request?.longitude) || 74.3213;

  return (
    <View style={styles.mapCard}>
      <View style={styles.mapHeader}>
        <View style={styles.mapTitleRow}>
          <AnyIcon
            type={Icons.Feather}
            name="map"
            size={moderateScale(14)}
            color={colors.primary}
          />
          <View>
            <AppText bold FONT_13 style={styles.mapTitle}>
              Navigation Route
            </AppText>
            <AppText regular style={styles.mapSubtitle}>
              Directions to destination hospital
            </AppText>
          </View>
        </View>
      </View>
      <View style={styles.mapCanvas}>
        <MapView
          provider={PROVIDER_DEFAULT}
          style={{ width: "100%", height: "100%" }}
          key={`map-${lat}-${lng}`}
          initialRegion={{
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
        >
          <Marker
            coordinate={{
              latitude: lat,
              longitude: lng,
            }}
            title={request?.hospital || "Hospital"}
            description={`Emergency Blood Request: ${request?.bloodType || ""}`}
          >
            <View
              style={{
                backgroundColor: colors.primary,
                padding: moderateScale(6),
                borderRadius: moderateScale(16),
                borderWidth: 2,
                borderColor: colors.white,
                alignItems: "center",
                justifyContent: "center",
                elevation: 4,
              }}
            >
              <AnyIcon
                type={Icons.Feather}
                name="droplet"
                size={moderateScale(14)}
                color={colors.white}
              />
            </View>
          </Marker>
        </MapView>

        {/* Floating Action Overlay on Map Canvas */}
        <View style={styles.mapOverlay}>
          <View style={styles.mapOverlayLeft}>
            <AppText
              bold
              FONT_11
              style={styles.mapOverlayHospital}
              numberOfLines={1}
            >
              {request?.hospital || "Hospital"}
            </AppText>
            <AppText regular style={styles.mapOverlayDistance}>
              {mapOverlayText}
            </AppText>
          </View>
          <TouchableOpacity
            style={styles.navigateBtn}
            onPress={onNavigate}
            activeOpacity={0.8}
          >
            <AnyIcon
              type={Icons.Feather}
              name="navigation"
              size={moderateScale(10)}
              color={colors.white}
            />
            <AppText bold FONT_10 style={styles.navigateBtnText}>
              Navigate
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
