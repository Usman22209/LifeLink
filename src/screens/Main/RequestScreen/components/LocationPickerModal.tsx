import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  FlatList,
  Keyboard,
} from "react-native";
import MapView, { PROVIDER_DEFAULT, Region } from "react-native-maps";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import ScreenWrapper from "@components/ScreenWrapper";
import AppHeader from "@components/AppHeader";
import AppText from "@components/AppText";
import AppButton from "@components/AppButton";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import { getCurrentLocation, Coords } from "@shared/utils/locationService";
import useTranslation from "@shared/hooks/useTranslation";
import ENV from "@config/env";
import { styles } from "../RequestScreen.styles";

export interface PlaceInfo {
  name?: string;
  address?: string;
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

const DEFAULT_REGION: Region = {
  latitude: 31.5204,
  longitude: 74.3587,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  visible,
  onClose,
  onConfirm,
  initialCoords,
}) => {
  const { t } = useTranslation();
  const mapRef = useRef<MapView>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [locating, setLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedPlaceInfo, setSelectedPlaceInfo] = useState<PlaceInfo | undefined>(undefined);

  const [region, setRegion] = useState<Region>(() => ({
    latitude: initialCoords?.latitude ?? DEFAULT_REGION.latitude,
    longitude: initialCoords?.longitude ?? DEFAULT_REGION.longitude,
    latitudeDelta: DEFAULT_REGION.latitudeDelta,
    longitudeDelta: DEFAULT_REGION.longitudeDelta,
  }));

  // ── Google Places Autocomplete ──
  const fetchPredictions = useCallback(async (text: string) => {
    if (!text || text.length < 3 || !ENV.MAP_API_KEY) {
      setPredictions([]);
      setShowResults(false);
      return;
    }
    setSearching(true);
    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        text,
      )}&components=country:pk&key=${ENV.MAP_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === "OK" && data.predictions) {
        setPredictions(data.predictions);
        setShowResults(true);
      } else {
        setPredictions([]);
      }
    } catch {
      setPredictions([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleSearchChange = useCallback(
    (text: string) => {
      setSearchQuery(text);
      if (searchTimer.current) clearTimeout(searchTimer.current);
      searchTimer.current = setTimeout(() => fetchPredictions(text), 400);
    },
    [fetchPredictions],
  );

  const handleSelectPlace = useCallback(
    async (placeId: string, description: string) => {
      Keyboard.dismiss();
      setSearchQuery(description);
      setShowResults(false);
      setPredictions([]);

      if (!ENV.MAP_API_KEY) return;

      try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,name,formatted_address&key=${ENV.MAP_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.status === "OK" && data.result?.geometry?.location) {
          const { lat, lng } = data.result.geometry.location;
          const newRegion: Region = {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setRegion(newRegion);
          mapRef.current?.animateToRegion(newRegion, 600);

          // Store place name & address for auto-fill
          setSelectedPlaceInfo({
            name: data.result.name || undefined,
            address: data.result.formatted_address || undefined,
          });
        }
      } catch {
        // Silently fail
      }
    },
    [],
  );

  // ── Locate Me ──
  const handleLocateMe = useCallback(async () => {
    setLocating(true);
    try {
      const coords = await getCurrentLocation();
      if (coords && mapRef.current) {
        const newRegion: Region = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        mapRef.current.animateToRegion(newRegion, 600);
        setRegion(newRegion);
      }
    } catch {
      // Silently fail
    } finally {
      setLocating(false);
    }
  }, []);

  const handleConfirm = () => {
    onConfirm(
      {
        latitude: region.latitude,
        longitude: region.longitude,
      },
      selectedPlaceInfo,
    );
  };

  const handleClose = () => {
    setSearchQuery("");
    setPredictions([]);
    setShowResults(false);
    onClose();
  };

  // ── Render autocomplete suggestion row ──
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
        <AppText semiBold FONT_13 style={{ color: colors.text }} numberOfLines={1}>
          {item.structured_formatting.main_text}
        </AppText>
        <AppText regular FONT_11 style={{ color: colors.textSecondary }} numberOfLines={1}>
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
          {/* Search Bar */}
          <View style={styles.searchBarContainer}>
            <View style={styles.searchBarInner}>
              <AnyIcon
                type={Icons.Feather}
                name="search"
                size={moderateScale(16)}
                color={colors.textSecondary}
              />
              <TextInput
                style={styles.searchBarInput}
                placeholder="Search hospital, area, or city..."
                placeholderTextColor={colors.placeholder}
                value={searchQuery}
                onChangeText={handleSearchChange}
                returnKeyType="search"
                autoCorrect={false}
                autoCapitalize="none"
              />
              {searching && (
                <ActivityIndicator size="small" color={colors.primary} />
              )}
              {!searching && searchQuery.length > 0 && (
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
                    size={moderateScale(18)}
                    color={colors.gray300}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Autocomplete Results Dropdown */}
            {showResults && predictions.length > 0 && (
              <View style={styles.predictionsContainer}>
                <FlatList
                  data={predictions}
                  renderItem={renderPrediction}
                  keyExtractor={(item) => item.place_id}
                  keyboardShouldPersistTaps="handled"
                  style={{ maxHeight: verticalScale(200) }}
                />
              </View>
            )}
          </View>

          {/* Map */}
          <MapView
            ref={mapRef}
            provider={PROVIDER_DEFAULT}
            style={styles.map}
            initialRegion={{
              latitude: initialCoords?.latitude ?? DEFAULT_REGION.latitude,
              longitude: initialCoords?.longitude ?? DEFAULT_REGION.longitude,
              latitudeDelta: DEFAULT_REGION.latitudeDelta,
              longitudeDelta: DEFAULT_REGION.longitudeDelta,
            }}
            onRegionChangeComplete={(r) => setRegion(r)}
            showsUserLocation
            showsMyLocationButton={false}
            onPress={() => {
              setShowResults(false);
              Keyboard.dismiss();
            }}
          />

          {/* Center Pin */}
          <View style={styles.centerMarkerContainer}>
            <AnyIcon
              type={Icons.MaterialIcons}
              name="location-on"
              size={moderateScale(36)}
              color={colors.primary}
            />
          </View>

          {/* Locate Me FAB */}
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

          {/* Confirm Button */}
          <View style={styles.floatingConfirmContainer}>
            <AppButton
              title={t("requestForm.confirmLocation") || "Confirm Selected Location"}
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
