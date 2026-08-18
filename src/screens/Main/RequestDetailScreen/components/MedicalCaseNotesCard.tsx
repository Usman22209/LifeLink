import React from "react";
import { View } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { styles } from "../RequestDetailScreen.styles";

interface MedicalCaseNotesCardProps {
  bloodType: string;
}

export const MedicalCaseNotesCard: React.FC<MedicalCaseNotesCardProps> = ({
  bloodType,
}) => {
  return (
    <View style={styles.caseNotesCard}>
      <AnyIcon
        type={Icons.Feather}
        name="info"
        size={moderateScale(15)}
        color={colors.primary}
        style={{ marginTop: verticalScale(1) }}
      />
      <View style={{ flex: 1 }}>
        <AppText bold FONT_13 style={styles.caseNotesTitle}>
          Medical Case Summary
        </AppText>
        <AppText regular FONT_11 style={styles.caseNotesText}>
          Emergency surgery request at Mayo Intensive Care Unit. The patient
          requires compatibly matched {bloodType} blood due to severe blood loss.
          Please respond if you are matching.
        </AppText>
      </View>
    </View>
  );
};
