import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import ScreenWrapper from "@components/ScreenWrapper";
import AppHeader from "@components/AppHeader";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { ROUTES } from "@utils/Routes";
import { selectUser, updateUser } from "@store/slices/authSlice";
import { selectLanguage, setLanguage } from "@store/slices/appSlice";
import { useQueryClient } from "@tanstack/react-query";
import useTranslation from "@shared/hooks/useTranslation";
import { useUpdateProfile, useGetProfile } from "@shared/query/profile/useProfile";
import {
  DONOR_QUESTIONS,
  evaluateDonorEligibility,
  saveStoredEligibility,
  getStoredEligibility,
  EligibilityResult,
} from "@shared/utils/donorEligibilityService";
import { styles } from "./DonorQuestionnaireScreen.styles";

const DonorQuestionnaireScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const reduxUser = useSelector(selectUser);
  const { data: profile } = useGetProfile();
  const selectedLang = useSelector(selectLanguage);
  const { mutateAsync: updateProfileMutate } = useUpdateProfile();

  const isEditing = Boolean(route.params?.isEditing);
  const returnTo = route.params?.returnTo;

  const queryClient = useQueryClient();
  const rawUser = profile?.data || profile?.user || profile || reduxUser;
  const user = rawUser?.user || rawUser?.profile || rawUser;

  const [currentLang, setCurrentLang] = useState<"en" | "ur">(
    selectedLang === "ur" ? "ur" : "en",
  );
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [evalResult, setEvalResult] = useState<EligibilityResult | null>(null);

  const verifiedLastDonation =
    user?.stats?.last_donated_at ||
    user?.last_donated_at;

  const isVerifiedDonationActive = useMemo(() => {
    if (!verifiedLastDonation) return false;
    const d = new Date(verifiedLastDonation);
    if (isNaN(d.getTime())) return false;
    const nextDate = new Date(d);
    nextDate.setDate(nextDate.getDate() + 90);
    return new Date() < nextDate;
  }, [verifiedLastDonation]);

  const liveEvaluation = useMemo(() => {
    const dob = user?.dob || user?.date_of_birth;
    const lastDonated = answers.recent_donation === false ? null : verifiedLastDonation;
    return evaluateDonorEligibility(answers, dob, lastDonated);
  }, [answers, user?.dob, user?.date_of_birth, verifiedLastDonation]);

  // Load existing saved answers on mount
  useEffect(() => {
    (async () => {
      const stored = await getStoredEligibility();
      if (stored && stored.answers) {
        const loadedAnswers = { ...stored.answers };
        if (isVerifiedDonationActive) {
          loadedAnswers.recent_donation = true;
        }
        setAnswers(loadedAnswers);
      } else {
        // Default answers: all set to the safe answer so user can quickly confirm
        const initialAnswers: Record<string, boolean> = {};
        DONOR_QUESTIONS.forEach((q) => {
          initialAnswers[q.id] = q.expectedAnswer;
        });
        if (isVerifiedDonationActive) {
          initialAnswers.recent_donation = true;
        }
        setAnswers(initialAnswers);
      }
    })();
  }, [isVerifiedDonationActive]);

  const handleSelectAnswer = (questionId: string, val: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: val,
    }));
  };

  const toggleLanguage = () => {
    const nextLang = currentLang === "en" ? "ur" : "en";
    setCurrentLang(nextLang);
    dispatch(setLanguage(nextLang));
  };

  const handleContinue = async () => {
    // Check that all questions are answered
    const unanswered = DONOR_QUESTIONS.filter(
      (q) => answers[q.id] === undefined,
    );
    if (unanswered.length > 0) {
      Alert.alert(
        currentLang === "ur" ? "تمام سوالات کا جواب دیں" : "Incomplete Questionnaire",
        currentLang === "ur"
          ? "براہ کرم آگے بڑھنے سے پہلے تمام سوالات کا جواب دیں۔"
          : "Please answer all health screening questions to continue.",
      );
      return;
    }

    const dob = user?.dob || user?.date_of_birth;
    const lastDonated = answers.recent_donation === false ? null : verifiedLastDonation;

    const evaluation = evaluateDonorEligibility(answers, dob, lastDonated);
    setEvalResult(evaluation);

    // 1. Save locally in AsyncStorage
    await saveStoredEligibility(evaluation);

    // 2. Update Redux user stats
    dispatch(
      updateUser({
        stats: {
          ...(user?.stats || {}),
          is_eligible: evaluation.isEligible,
          next_eligible_date: evaluation.nextEligibleDate || null,
        },
      }),
    );

    // 3. Sync to backend: if recent donation reported, preserve active date or set today; if not, clear it!
    try {
      if (answers.recent_donation === true) {
        const targetDate = isVerifiedDonationActive && verifiedLastDonation
          ? verifiedLastDonation
          : new Date().toISOString().split("T")[0];
        await updateProfileMutate({
          last_donated_at: targetDate,
        } as any);
      } else if (!isVerifiedDonationActive) {
        await updateProfileMutate({
          last_donated_at: null,
        } as any);
      }
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    } catch (err) {
      console.log("Could not sync last_donated_at to backend:", err);
    }

    // 4. Show result modal
    setResultModalVisible(true);
  };

  const handleFinish = () => {
    setResultModalVisible(false);

    if (isEditing || returnTo) {
      navigation.goBack();
    } else {
      // Mark onboarded and proceed to main app
      dispatch(updateUser({ is_onboarded: true }));
      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.MAIN_FLOW }],
      });
    }
  };

  const handleSkip = () => {
    if (isEditing) {
      navigation.goBack();
    } else {
      dispatch(updateUser({ is_onboarded: true }));
      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.MAIN_FLOW }],
      });
    }
  };

  return (
    <ScreenWrapper
      backgroundColor={colors.background}
      safeArea
      scrollable={false}
      style={styles.wrapper}
      header={
        isEditing ? (
          <AppHeader
            title={currentLang === "ur" ? "ڈونر اسکریننگ" : "Donor Screening"}
            showBackButton
            onBackPress={() => navigation.goBack()}
            hasBorder
          />
        ) : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Title & Language Switcher */}
        <View style={styles.headerRow}>
          <AppText bold FONT_20 style={styles.title}>
            {currentLang === "ur" ? "ڈونر سوالنامہ" : "Questionnaires"}
          </AppText>

          <TouchableOpacity
            style={styles.langButton}
            onPress={toggleLanguage}
            activeOpacity={0.8}
          >
            <AppText bold FONT_11 style={styles.langButtonText}>
              {currentLang === "ur" ? "Switch to English" : "Switch to Urdu"}
            </AppText>
          </TouchableOpacity>
        </View>

        <AppText regular FONT_12 style={styles.subtitle}>
          {currentLang === "ur"
            ? "خون کا عطیہ دینے کے لیے درج ذیل سوالنامے کو پُر کریں اور ڈونر بنیں۔"
            : "Fill up the following Questionnaires and become a donor"}
        </AppText>

        {/* Live Real-Time Eligibility Bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: scale(14),
            paddingVertical: verticalScale(10),
            borderRadius: moderateScale(12),
            backgroundColor: liveEvaluation.isEligible
              ? "rgba(46, 204, 113, 0.08)"
              : "rgba(245, 166, 35, 0.09)",
            borderWidth: 1.2,
            borderColor: liveEvaluation.isEligible
              ? "rgba(46, 204, 113, 0.35)"
              : "rgba(245, 166, 35, 0.4)",
            marginBottom: verticalScale(16),
            gap: scale(10),
          }}
        >
          <AnyIcon
            type={Icons.Feather}
            name={liveEvaluation.isEligible ? "check-circle" : "alert-circle"}
            size={moderateScale(20)}
            color={liveEvaluation.isEligible ? colors.success : colors.warning}
          />
          <View style={{ flex: 1 }}>
            <AppText
              bold
              FONT_12
              style={{
                color: liveEvaluation.isEligible ? colors.success : "#D97706",
              }}
            >
              {liveEvaluation.isEligible
                ? currentLang === "ur"
                  ? "اسٹیٹس: خون دینے کے اہل ✓ (تمام شرائط پوری ہیں)"
                  : "Live Status: Eligible to Donate ✓"
                : currentLang === "ur"
                ? `اسٹیٹس: فی الحال نااہل (${liveEvaluation.reasons.length} رکاوٹ)`
                : `Live Status: Deferred (${liveEvaluation.reasons.length} requirement not met)`}
            </AppText>
            {!liveEvaluation.isEligible && liveEvaluation.reasons.length > 0 && (
              <AppText
                regular
                FONT_10
                style={{ color: colors.textSecondary, marginTop: 2 }}
                numberOfLines={1}
              >
                {currentLang === "ur"
                  ? (liveEvaluation.reasonsUr?.[0] || liveEvaluation.reasons[0])
                  : liveEvaluation.reasons[0]}
              </AppText>
            )}
          </View>
        </View>

        {/* Questions Cards List */}
        {DONOR_QUESTIONS.map((q) => {
          const selected = answers[q.id];
          const questionText = currentLang === "ur" ? q.questionUr : q.questionEn;

          return (
            <View key={q.id} style={styles.questionCard}>
              <AppText semiBold FONT_13 style={styles.questionText}>
                {questionText}
              </AppText>

              {q.id === "recent_donation" && isVerifiedDonationActive && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: scale(6),
                    marginTop: verticalScale(6),
                    marginBottom: verticalScale(4),
                    paddingHorizontal: scale(10),
                    paddingVertical: verticalScale(6),
                    backgroundColor: "rgba(245, 158, 11, 0.1)",
                    borderRadius: moderateScale(8),
                    borderWidth: 1,
                    borderColor: "rgba(245, 158, 11, 0.25)",
                  }}
                >
                  <AnyIcon
                    type={Icons.Feather}
                    name="clock"
                    size={moderateScale(13)}
                    color="#D97706"
                  />
                  <AppText semiBold FONT_11 style={{ color: "#D97706", flex: 1 }}>
                    {currentLang === "ur"
                      ? `تصدیق شدہ عطیہ: ${verifiedLastDonation}۔ 90 دن کا بحالی کا وقفہ جاری ہے۔`
                      : `Verified donation on ${verifiedLastDonation}. 90-day recovery cooldown is active.`}
                  </AppText>
                </View>
              )}

              <View style={styles.radioRow}>
                {/* Yes Option */}
                <TouchableOpacity
                  style={styles.radioOption}
                  activeOpacity={0.7}
                  onPress={() => handleSelectAnswer(q.id, true)}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      selected === true && styles.radioCircleSelected,
                    ]}
                  >
                    {selected === true && <View style={styles.radioInnerDot} />}
                  </View>
                  <AppText
                    medium
                    FONT_13
                    style={[
                      styles.radioLabel,
                      selected === true && { color: colors.primary, fontWeight: "700" },
                    ]}
                  >
                    {currentLang === "ur" ? "ہاں (Yes)" : "Yes"}
                  </AppText>
                </TouchableOpacity>

                {/* No Option */}
                <TouchableOpacity
                  style={styles.radioOption}
                  activeOpacity={0.7}
                  onPress={() => handleSelectAnswer(q.id, false)}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      selected === false && styles.radioCircleSelected,
                    ]}
                  >
                    {selected === false && <View style={styles.radioInnerDot} />}
                  </View>
                  <AppText
                    medium
                    FONT_13
                    style={[
                      styles.radioLabel,
                      selected === false && { color: colors.primary, fontWeight: "700" },
                    ]}
                  >
                    {currentLang === "ur" ? "نہیں (No)" : "No"}
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        <AppText regular FONT_10 style={styles.disclaimer}>
          {currentLang === "ur"
            ? "جاری رکھ کر، آپ تصدیق کرتے ہیں کہ آپ نے تمام معلومات ایمانداری سے فراہم کی ہیں۔ آپ کی صحت سے متعلق ڈیٹا آپ کے آلے پر محفوظ اور پرائیویٹ رہتا ہے۔"
            : "By continuing, you certify that all health information is accurate to the best of your knowledge. Your private health answers remain confidential on your device."}
        </AppText>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <AppText bold FONT_14 style={styles.submitButtonText}>
            {currentLang === "ur" ? "جاری رکھیں (Continue)" : "Continue"}
          </AppText>
        </TouchableOpacity>

        {!isEditing && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <AppText regular FONT_12 style={styles.skipButtonText}>
              {currentLang === "ur" ? "بعد میں کریں (Skip for now)" : "Skip for now"}
            </AppText>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Result Evaluation Modal */}
      <Modal
        visible={resultModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleFinish}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {evalResult?.isEligible ? (
              <>
                <View
                  style={[
                    styles.modalIconWrap,
                    { backgroundColor: "rgba(46, 125, 50, 0.12)" },
                  ]}
                >
                  <AnyIcon
                    type={Icons.Feather}
                    name="check-circle"
                    size={moderateScale(32)}
                    color={colors.success}
                  />
                </View>
                <AppText bold FONT_18 style={styles.modalTitle}>
                  {currentLang === "ur"
                    ? "آپ خون کا عطیہ دینے کے اہل ہیں! 🎉"
                    : "You're Eligible to Donate! 🎉"}
                </AppText>
                <AppText regular FONT_12 style={styles.modalSubtitle}>
                  {currentLang === "ur"
                    ? "مبارک ہو! آپ کا ڈونر اسٹیٹس فعال کر دیا گیا ہے۔ جب بھی آپ کے بلڈ گروپ کی ایمرجنسی ہوگی آپ کو مطلع کیا جائے گا۔"
                    : "Congratulations! Your active donor status has been verified. You'll be notified when emergency requests match your blood type."}
                </AppText>
              </>
            ) : (
              <>
                <View
                  style={[
                    styles.modalIconWrap,
                    { backgroundColor: "rgba(245, 158, 11, 0.12)" },
                  ]}
                >
                  <AnyIcon
                    type={Icons.Feather}
                    name="alert-circle"
                    size={moderateScale(32)}
                    color={colors.warning}
                  />
                </View>
                <AppText bold FONT_18 style={styles.modalTitle}>
                  {currentLang === "ur"
                    ? "ڈونر اسکریننگ کا نتیجہ"
                    : "Donor Eligibility Status"}
                </AppText>
                <AppText regular FONT_12 style={styles.modalSubtitle}>
                  {currentLang === "ur"
                    ? "آپ کے فراہم کردہ جوابات کے مطابق فی الحال آپ خون دینے کے اہل نہیں ہیں:"
                    : "Based on your screening answers, you are currently deferred from blood donation:"}
                </AppText>

                <View style={styles.reasonsBox}>
                  {(currentLang === "ur"
                    ? evalResult?.reasonsUr || evalResult?.reasons
                    : evalResult?.reasons
                  )?.map((r, i) => (
                    <View key={i} style={styles.reasonItem}>
                      <AppText bold FONT_11 style={styles.reasonBullet}>
                        •
                      </AppText>
                      <AppText regular FONT_11 style={styles.reasonText}>
                        {r}
                      </AppText>
                    </View>
                  ))}
                </View>

                <AppText regular FONT_11 style={[styles.modalSubtitle, { marginBottom: 16 }]}>
                  {currentLang === "ur"
                    ? "آپ بدستور مریضوں کے لیے بلڈ ریکوئسٹ پوسٹ کر سکتے ہیں اور کمیونٹی ریکوئسٹس شیئر کر سکتے ہیں۔"
                    : "You can still request blood for family and friends, share emergency requests, and manage requests."}
                </AppText>
              </>
            )}

            <TouchableOpacity
              style={styles.modalPrimaryBtn}
              onPress={handleFinish}
              activeOpacity={0.8}
            >
              <AppText bold FONT_13 style={styles.modalPrimaryBtnText}>
                {evalResult?.isEligible
                  ? currentLang === "ur"
                    ? "شروع کریں (Get Started)"
                    : "Go to Dashboard"
                  : currentLang === "ur"
                  ? "سمجھ گیا (Acknowledge & Continue)"
                  : "Acknowledge & Continue"}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenWrapper>
  );
};

export default DonorQuestionnaireScreen;
