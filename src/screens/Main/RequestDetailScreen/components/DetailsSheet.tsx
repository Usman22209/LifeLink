import React from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { styles } from "../RequestDetailScreen.styles";

interface DetailsSheetProps {
  request: any;
  cityName: string;
  provinceName: string;
}

export const DetailsSheet: React.FC<DetailsSheetProps> = ({
  request,
  cityName,
  provinceName,
}) => {
  const renderInfoRow = (
    icon: string,
    label: string,
    value: string | number,
    isLast = false,
  ) => (
    <View style={[styles.infoRow, isLast && { borderBottomWidth: 0 }]}>
      <View style={styles.infoRowLeft}>
        <AnyIcon
          type={Icons.Feather}
          name={icon}
          size={moderateScale(12)}
          color={colors.primary}
        />
        <AppText bold FONT_10 style={styles.infoLabel}>
          {label.toUpperCase()}
        </AppText>
      </View>
      <AppText semiBold FONT_13 style={styles.infoValue}>
        {value}
      </AppText>
    </View>
  );

  return (
    <View style={styles.infoContainer}>
      {renderInfoRow(
        "user",
        "Patient",
        request?.patientName || "Anonymous Patient",
      )}
      {renderInfoRow("droplet", "Blood Group", request?.bloodType || "N/A")}
      {renderInfoRow(
        "database",
        "Units Required",
        `${request?.units || 1} ${(request?.units || 1) === 1 ? "Unit" : "Units"}`,
      )}
      {renderInfoRow("clock", "Time Posted", request?.time || "Just now")}
      {renderInfoRow(
        "alert-circle",
        "Required Deadline",
        request?.time_left ? `${request.time_left} remaining` : "Immediate",
      )}
      {renderInfoRow("home", "Hospital", request?.hospital || "Hospital")}
      {renderInfoRow("navigation", "City", cityName || "Unknown City")}
      {renderInfoRow("map", "State / Province", provinceName || "N/A")}
      {request?.hide_phone_number ||
      (!request?.contact_number && !request?.contactNumber)
        ? renderInfoRow("shield", "Contact Privacy", "In-App Chat Only", true)
        : renderInfoRow(
            "phone",
            "Contact Number",
            request?.contact_number || request?.contactNumber,
            true,
          )}
    </View>
  );
};
