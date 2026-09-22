import React from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { WebView } from "react-native-webview";
import { moderateScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { styles } from "../RequestDetailScreen.styles";

interface MapPreviewCardProps {
  request: any;
  mapOverlayText: string;
  onNavigate: () => void;
}

const getPreviewLeafletHtml = (lat: number, lng: number) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body, #map {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      background: #f5f5f7;
    }
    .custom-pin {
      background-color: #E53935;
      width: 24px;
      height: 24px;
      border-radius: 12px;
      border: 2px solid #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0px 2px 4px rgba(0,0,0,0.3);
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      touchZoom: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false
    }).setView([${lat}, ${lng}], 15);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    var customIcon = L.divIcon({
      className: 'custom-pin-wrapper',
      html: '<div class="custom-pin"><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    L.marker([${lat}, ${lng}], { icon: customIcon }).addTo(map);
  </script>
</body>
</html>
`;

export const MapPreviewCard: React.FC<MapPreviewCardProps> = ({
  request,
  mapOverlayText,
  onNavigate,
}) => {
  const { t } = useTranslation();
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
              {t("requestDetail.navRoute") || "Navigation Route"}
            </AppText>
            <AppText regular style={styles.mapSubtitle}>
              {t("requestDetail.navDirections") ||
                "Directions to destination hospital"}
            </AppText>
          </View>
        </View>
      </View>
      <View style={styles.mapCanvas}>
        {Platform.OS === "ios" ? (
          <WebView
            style={{ width: "100%", height: "100%" }}
            originWhitelist={["*"]}
            source={{ html: getPreviewLeafletHtml(lat, lng) }}
            javaScriptEnabled
            domStorageEnabled
            scrollEnabled={false}
            bounces={false}
          />
        ) : (
          <MapView
            provider={PROVIDER_GOOGLE}
            mapType="standard"
            userInterfaceStyle="light"
            tintColor="transparent"
            showsUserLocation={false}
            showsBuildings={false}
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
        )}

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
              {t("requestDetail.navigate") || "Navigate"}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
