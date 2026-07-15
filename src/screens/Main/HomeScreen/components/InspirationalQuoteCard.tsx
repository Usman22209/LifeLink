import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  I18nManager,
} from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";

const InspirationalQuoteCard = () => {
  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { t } = useTranslation();
  const isRtl = I18nManager.isRTL;

  const quotes = [
    {
      text: t("quotes.factText1"),
      author: t("quotes.factAuthor1"),
      icon: "award",
    },
    {
      text: t("quotes.factText2"),
      author: t("quotes.factAuthor2"),
      icon: "heart",
    },
    {
      text: t("quotes.factText3"),
      author: t("quotes.factAuthor3"),
      icon: "sun",
    },
    {
      text: t("quotes.factText4"),
      author: t("quotes.factAuthor4"),
      icon: "users",
    },
  ];

  const handleNextQuote = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const current = quotes[index];

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={handleNextQuote}
    >
      <View
        style={[
          styles.quoteMarkContainer,
          { [isRtl ? "right" : "left"]: scale(8) },
        ]}
      >
        <Text extraBold style={styles.quoteMark}>
          “
        </Text>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View
          style={[
            styles.header,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          <View
            style={[
              styles.categoryBadge,
              { flexDirection: isRtl ? "row-reverse" : "row" },
            ]}
          >
            <AnyIcon
              type={Icons.Feather}
              name={current.icon}
              size={moderateScale(12)}
              color={colors.primary}
            />
            <Text
              semiBold
              FONT_9
              style={[
                styles.categoryText,
                { [isRtl ? "marginRight" : "marginLeft"]: scale(4) },
              ]}
            >
              {current.author}
            </Text>
          </View>
        </View>

        <Text
          medium
          FONT_13
          style={[styles.quoteText, { textAlign: isRtl ? "right" : "left" }]}
        >
          {current.text}
        </Text>

        <View
          style={[
            styles.footer,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          <Text medium FONT_9 style={styles.tapTip}>
            {t("home.tapForTip")}
          </Text>
          <View style={{ [isRtl ? "marginRight" : "marginLeft"]: scale(4) }}>
            <AnyIcon
              type={Icons.Feather}
              name="refresh-cw"
              size={moderateScale(10)}
              color={colors.textSecondary}
            />
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default InspirationalQuoteCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: moderateScale(16),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
    borderWidth: 0.5,
    borderColor: withOpacity(colors.border, 0.3),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
    overflow: "hidden",
    position: "relative",
  },
  quoteMarkContainer: {
    position: "absolute",
    top: -verticalScale(10),
    opacity: 0.05,
  },
  quoteMark: {
    fontSize: moderateScale(72),
    color: colors.text,
  },
  content: {
    zIndex: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  categoryBadge: {
    alignItems: "center",
    backgroundColor: withOpacity(colors.primary, 0.06),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(8),
  },
  categoryText: {
    color: colors.primary,
  },
  quoteText: {
    color: colors.text,
    lineHeight: verticalScale(18),
  },
  footer: {
    alignItems: "center",
    marginTop: verticalScale(10),
  },
  tapTip: {
    color: colors.textSecondary,
  },
});
