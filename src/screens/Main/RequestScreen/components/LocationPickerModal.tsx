import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  FlatList,
  Keyboard,
  Platform,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import { WebView } from "react-native-webview";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import ScreenWrapper from "@components/ScreenWrapper";
import AppHeader from "@components/AppHeader";
import AppText from "@components/AppText";
import AppButton from "@components/AppButton";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import { getCurrentLocation, Coords } from "@shared/utils/locationService";
import useTranslation from "@shared/hooks/useTranslation";
import { findCityRecord } from "@shared/utils/cityUtils";
import ENV from "@config/env";
import { styles } from "../RequestScreen.styles";

export interface PlaceInfo {
  name?: string;
  address?: string;
  cityName?: string;
  provinceName?: string;
  cityId?: string;
}

interface LocationPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (coords: Coords, placeInfo?: PlaceInfo) => void;
  initialCoords?: Coords | null;
}

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

const DEFAULT_COORDS = {
  latitude: 31.5204,
  longitude: 74.3587,
};

const getLeafletHtml = (lat: number, lng: number) => `
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
    .leaflet-control-container .leaflet-routing-container-hide {
      display: none;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', {
      zoomControl: false,
      attributionControl: false
    }).setView([${lat}, ${lng}], 15);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a','b','c']
    }).addTo(map);

    map.on('moveend', function() {
      var center = map.getCenter();
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'REGION_CHANGE',
        latitude: center.lat,
        longitude: center.lng
      }));
    });

    window.setMapCenter = function(lat, lng) {
      map.setView([lat, lng], 16, { animate: true });
    };
  </script>
</body>
</html>
`;

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  visible,
  onClose,
  onConfirm,
  initialCoords,
}) => {
  const { t } = useTranslation();
  const webViewRef = useRef<any>(null);
  const mapRef = useRef<MapView>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [locating, setLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedPlaceInfo, setSelectedPlaceInfo] = useState<
    PlaceInfo | undefined
  >(undefined);
  const [mapLoaded, setMapLoaded] = useState(false);

  const regionRef = useRef<{ latitude: number; longitude: number }>({
    latitude: initialCoords?.latitude ?? DEFAULT_COORDS.latitude,
    longitude: initialCoords?.longitude ?? DEFAULT_COORDS.longitude,
  });

  useEffect(() => {
    if (visible) {
      console.log("[LocationPickerModal] Modal opened | initialCoords:", initialCoords);
      const coords = {
        latitude: initialCoords?.latitude ?? DEFAULT_COORDS.latitude,
        longitude: initialCoords?.longitude ?? DEFAULT_COORDS.longitude,
      };
      regionRef.current = coords;
      setSelectedPlaceInfo(undefined);
      setSearchQuery("");
      setPredictions([]);
      setShowResults(false);

      const timer = setTimeout(() => {
        console.log("[LocationPickerModal] Mounting MapView...");
        setMapLoaded(true);
      }, 250);

      return () => clearTimeout(timer);
    } else {
      console.log("[LocationPickerModal] Modal closing.");
      setMapLoaded(false);
    }
  }, [visible, initialCoords]);

  const isProgrammaticChangeRef = useRef(false);

  const fetchPredictions = useCallback(async (text: string) => {
    if (!text || text.length < 3 || !ENV.MAP_API_KEY) {
      setPredictions([]);
      setShowResults(false);
      return;
    }
    console.log("[LocationPickerModal] Searching predictions for query:", text);
    setSearching(true);
    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        text,
      )}&components=country:pk&key=${ENV.MAP_API_KEY}`;
      const res = await fetch(url);
      const data: any = await res.json();
      console.log("[LocationPickerModal] Predictions response status:", data.status, "Count:", data.predictions?.length || 0);
      if (data.status === "OK" && data.predictions) {
        setPredictions(data.predictions);
        setShowResults(true);
      } else {
        setPredictions([]);
      }
    } catch (error) {
      console.log("[LocationPickerModal] Predictions fetch error:", error);
      setPredictions([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchQuery(text);
      if (isProgrammaticChangeRef.current) {
        isProgrammaticChangeRef.current = false;
        return;
      }
      if (searchTimer.current) clearTimeout(searchTimer.current);
      searchTimer.current = setTimeout(() => fetchPredictions(text), 400);
    },
    [fetchPredictions],
  );

  const handleSelectPlace = useCallback(
    async (placeId: string, description: string) => {
      console.log("[LocationPickerModal] Selecting place:", placeId, description);
      if (searchTimer.current) clearTimeout(searchTimer.current);
      isProgrammaticChangeRef.current = true;
      Keyboard.dismiss();
      setSearchQuery(description);
      setShowResults(false);
      setPredictions([]);

      if (!ENV.MAP_API_KEY) {
        console.log("[LocationPickerModal] MAP_API_KEY missing");
        return;
      }

      try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,name,formatted_address,address_components&key=${ENV.MAP_API_KEY}`;
        const res = await fetch(url);
        const data: any = await res.json();
        console.log("[LocationPickerModal] Place details status:", data.status);
        if (data.status === "OK" && data.result?.geometry?.location) {
          const { lat, lng } = data.result.geometry.location;
          console.log("[LocationPickerModal] Navigating map to coords:", lat, lng);
          regionRef.current = { latitude: lat, longitude: lng };
          
          if (Platform.OS === "ios") {
            webViewRef.current?.injectJavaScript(
              `if(window.setMapCenter) window.setMapCenter(${lat}, ${lng}); true;`
            );
          } else {
            mapRef.current?.animateToRegion(
              {
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              },
              600
            );
          }

          let extractedCity = "";
          let extractedProvince = "";

          if (data.result.address_components) {
            for (const comp of data.result.address_components) {
              if (
                comp.types.includes("locality") ||
                comp.types.includes("postal_town")
              ) {
                extractedCity = comp.long_name;
              } else if (
                !extractedCity &&
                comp.types.includes("administrative_area_level_2")
              ) {
                extractedCity = comp.long_name;
              }
              if (comp.types.includes("administrative_area_level_1")) {
                extractedProvince = comp.long_name;
              }
            }
          }

          if (!extractedCity && data.result.formatted_address) {
            const parts = data.result.formatted_address
              .split(",")
              .map((p: string) => p.trim());
            for (const part of parts) {
              const matched = findCityRecord(part);
              if (matched) {
                extractedCity = matched.name.en;
                extractedProvince = matched.province;
                break;
              }
            }
          }

          const matchedRecord = findCityRecord(extractedCity, extractedProvince);
          console.log("[LocationPickerModal] Place matched city record:", matchedRecord?.name?.en, matchedRecord?.id);

          setSelectedPlaceInfo({
            name: data.result.name || undefined,
            address: data.result.formatted_address || undefined,
            cityName: matchedRecord?.name.en || extractedCity || undefined,
            provinceName: matchedRecord?.province || extractedProvince || undefined,
            cityId: matchedRecord?.id || undefined,
          });
        }
      } catch (error) {
        console.log("[LocationPickerModal] Select place error:", error);
      }
    },
    [],
  );

  const handleLocateMe = useCallback(async () => {
    console.log("[LocationPickerModal] Requesting user location...");
    setLocating(true);
    try {
      const coords = await getCurrentLocation();
      console.log("[LocationPickerModal] User location result:", coords);
      if (coords) {
        regionRef.current = { latitude: coords.latitude, longitude: coords.longitude };
        if (Platform.OS === "ios") {
          webViewRef.current?.injectJavaScript(
            `if(window.setMapCenter) window.setMapCenter(${coords.latitude}, ${coords.longitude}); true;`
          );
        } else {
          mapRef.current?.animateToRegion(
            {
              latitude: coords.latitude,
              longitude: coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            600
          );
        }
      }
    } catch (error) {
      console.log("[LocationPickerModal] Locate me error:", error);
    } finally {
      setLocating(false);
    }
  }, []);

  const handleConfirm = async () => {
    let info = selectedPlaceInfo;
    const currentRegion = regionRef.current;
    console.log("[LocationPickerModal] Confirm pressed | region:", currentRegion, "info:", info);

    if (!info?.cityId && ENV.MAP_API_KEY) {
      try {
        console.log("[LocationPickerModal] Reverse geocoding pinned coords...");
        const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentRegion.latitude},${currentRegion.longitude}&key=${ENV.MAP_API_KEY}`;
        const res = await fetch(geoUrl);
        const geoData: any = await res.json();
        console.log("[LocationPickerModal] Reverse geocode status:", geoData.status);
        if (geoData.status === "OK" && geoData.results?.[0]) {
          const topResult = geoData.results[0];
          let city = "";
          let prov = "";
          for (const comp of topResult.address_components) {
            if (
              comp.types.includes("locality") ||
              comp.types.includes("postal_town") ||
              comp.types.includes("administrative_area_level_2")
            ) {
              if (!city) city = comp.long_name;
            }
            if (comp.types.includes("administrative_area_level_1")) {
              prov = comp.long_name;
            }
          }
          const matchedRecord = findCityRecord(city, prov);
          info = {
            name: info?.name || topResult.formatted_address?.split(",")?.[0],
            address: info?.address || topResult.formatted_address,
            cityName: matchedRecord?.name.en || city || undefined,
            provinceName: matchedRecord?.province || prov || undefined,
            cityId: matchedRecord?.id || undefined,
          };
          console.log("[LocationPickerModal] Resolved place info:", info);
        }
      } catch (error) {
        console.log("[LocationPickerModal] Reverse geocode error:", error);
      }
    }

    onConfirm(
      {
        latitude: currentRegion.latitude,
        longitude: currentRegion.longitude,
      },
      info,
    );
  };

  const handleClose = () => {
    console.log("[LocationPickerModal] Closing modal");
    setSearchQuery("");
    setPredictions([]);
    setShowResults(false);
    onClose();
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "REGION_CHANGE") {
        console.log("[LocationPickerModal] Region change complete:", data.latitude, data.longitude);
        regionRef.current = { latitude: data.latitude, longitude: data.longitude };
      }
    } catch {
      // ignore
    }
  };
  const renderPrediction = ({ item }: { item: PlacePrediction }) => (
    <TouchableOpacity
      style={styles.predictionRow}
      activeOpacity={0.7}
      onPress={() => handleSelectPlace(item.place_id, item.description)}
    >
      <AnyIcon
        type={Icons.MaterialIcons}
        name="location-on"
        size={moderateScale(18)}
        color={colors.primary}
        style={{ marginRight: scale(10) }}
      />
      <View style={{ flex: 1 }}>
        <AppText
          semiBold
          FONT_13
          style={{ color: colors.text }}
          numberOfLines={1}
        >
          {item.structured_formatting.main_text}
        </AppText>
        <AppText
          regular
          FONT_11
          style={{ color: colors.textSecondary }}
          numberOfLines={1}
        >
          {item.structured_formatting.secondary_text}
        </AppText>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <ScreenWrapper safeArea backgroundColor={colors.white}>
        <AppHeader
          title={t("requestForm.selectOnMap") || "Pin Location on Map"}
          showBackButton
          onBackPress={handleClose}
          hasBorder={false}
        />

        <View style={styles.mapWrapper}>
          <View style={styles.searchBarContainer}>
            <View style={styles.searchBarInner}>
              <AnyIcon
                type={Icons.Feather}
                name="search"
                size={moderateScale(15)}
                color={colors.textSecondary}
              />
              <TextInput
                style={styles.searchBarInput}
                placeholder={
                  t("requestForm.searchLocation") ||
                  "Search hospital, area, landmark..."
                }
                placeholderTextColor={colors.placeholder}
                value={searchQuery}
                onChangeText={handleSearchChange}
                returnKeyType="search"
                autoCorrect={false}
              />
              {searching && (
                <ActivityIndicator
                  size="small"
                  color={colors.primary}
                  style={{ marginRight: scale(4) }}
                />
              )}
              {searchQuery.length > 0 && !searching && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery("");
                    setPredictions([]);
                    setShowResults(false);
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <AnyIcon
                    type={Icons.Ionicons}
                    name="close-circle"
                    size={moderateScale(16)}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              )}
            </View>

            {showResults && predictions.length > 0 && (
              <View style={styles.predictionsContainer}>
                <FlatList
                  data={predictions}
                  keyExtractor={(item) => item.place_id}
                  renderItem={renderPrediction}
                  keyboardShouldPersistTaps="handled"
                  style={{ maxHeight: verticalScale(220) }}
                />
              </View>
            )}
          </View>

          {mapLoaded ? (
            Platform.OS === "ios" ? (
              <WebView
                ref={webViewRef}
                style={styles.map}
                originWhitelist={["*"]}
                source={{
                  html: getLeafletHtml(
                    regionRef.current.latitude,
                    regionRef.current.longitude
                  ),
                }}
                onMessage={handleWebViewMessage}
                javaScriptEnabled
                domStorageEnabled
                scrollEnabled={false}
                bounces={false}
                onPress={() => {
                  setShowResults(false);
                  Keyboard.dismiss();
                }}
              />
            ) : (
              <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                  latitude: regionRef.current.latitude,
                  longitude: regionRef.current.longitude,
                  latitudeDelta: 0.03,
                  longitudeDelta: 0.03,
                }}
                onRegionChangeComplete={(r) => {
                  regionRef.current = { latitude: r.latitude, longitude: r.longitude };
                }}
                showsUserLocation
                showsMyLocationButton={false}
                onPress={() => {
                  setShowResults(false);
                  Keyboard.dismiss();
                }}
              />
            )
          ) : (
            <View style={[styles.map, { justifyContent: "center", alignItems: "center", backgroundColor: colors.gray100 }]}>
              <ActivityIndicator size="large" color={colors.primary} />
              <AppText regular FONT_12 style={{ marginTop: verticalScale(8), color: colors.textSecondary }}>
                {t("requestForm.loadingMap") || "Loading map..."}
              </AppText>
            </View>
          )}

          <View style={styles.centerMarkerContainer}>
            <AnyIcon
              type={Icons.MaterialIcons}
              name="location-on"
              size={moderateScale(36)}
              color={colors.primary}
            />
          </View>

          <TouchableOpacity
            style={styles.floatingLocateButton}
            activeOpacity={0.8}
            onPress={handleLocateMe}
          >
            {locating ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <AnyIcon
                type={Icons.MaterialIcons}
                name="my-location"
                size={moderateScale(22)}
                color={colors.primary}
              />
            )}
          </TouchableOpacity>

          <View style={styles.floatingConfirmContainer}>
            <AppButton
              title={
                t("requestForm.confirmLocation") || "Confirm Selected Location"
              }
              onPress={handleConfirm}
              style={styles.confirmButton}
            />
          </View>
        </View>
      </ScreenWrapper>
    </Modal>
  );
};

export default LocationPickerModal;
