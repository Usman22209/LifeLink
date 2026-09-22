import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
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
import { selectLanguage } from "@store/slices/appSlice";
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
  const currentLang = selectedLang === "ur" ? "ur" : "en";
  const { mutateAsync: updateProfileMutate } = useUpdateProfile();

  const isEditing = Boolean(route.params?.isEditing);
  const returnTo = route.params?.returnTo;

  const queryClient = useQueryClient();
  const rawUser = profile?.data || profile?.user || profile || reduxUser;
  const user = rawUser?.user || rawUser?.profile || rawUser;

  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [originalAnswers, setOriginalAnswers] = useState<Record<string, boolean>>({});
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [evalResult, setEvalResult] = useState<EligibilityResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const isDirty = useMemo(() => {
    if (isInitializing) return false;
    const keys = Object.keys(answers);
    if (keys.length === 0) return false;
    return keys.some((k) => answers[k] !== originalAnswers[k]);
  }, [answers, originalAnswers, isInitializing]);

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

  useEffect(() => {
    (async () => {
      try {
        const stored = await getStoredEligibility(user?.id);
        let loaded: Record<string, boolean>;
        if (stored && stored.answers) {
          loaded = { ...stored.answers };
          if (isVerifiedDonationActive) {
            loaded.recent_donation = true;
          }
        } else {
          loaded = {};
          DONOR_QUESTIONS.forEach((q) => {
            loaded[q.id] = q.expectedAnswer;
          });
          if (isVerifiedDonationActive) {
            loaded.recent_donation = true;
          }
        }
        setAnswers(loaded);
        setOriginalAnswers(loaded);
      } finally {
        setIsInitializing(false);
      }
    })();
  }, [isVerifiedDonationActive]);

  const handleSelectAnswer = (questionId: string, val: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: val,
    }));
  };

  const handleBack = () => {
    if (isDirty && isEditing) {
      Alert.alert(
        currentLang === "ur" ? "غیر محفوظ شدہ تبدیلیاں" : "Unsaved Changes",
        currentLang === "ur"
          ? "آپ نے سوالنامے میں تبدیلیاں کی ہیں۔ کیا آپ واپس جانے سے پہلے محفوظ کرنا چاہتے ہیں؟"
          : "You have modified your health screening answers. Do you want to save before leaving?",
        [
          {
            text: currentLang === "ur" ? "رد کریں" : "Discard",
            style: "destructive",
            onPress: () => navigation.goBack(),
          },
          {
            text: currentLang === "ur" ? "محفوظ کریں" : "Save & Exit",
            onPress: () => handleContinue(),
          },
        ],
      );
    } else {
      navigation.goBack();
    }
  };

  const handleContinue = async () => {
    if (isSubmitting) return;

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

    setIsSubmitting(true);
    try {
      const dob = user?.dob || user?.date_of_birth;
      const lastDonated = answers.recent_donation === false ? null : verifiedLastDonation;

      const evaluation = evaluateDonorEligibility(answers, dob, lastDonated);
      setEvalResult(evaluation);

      await saveStoredEligibility(evaluation, user?.id);

      dispatch(
        updateUser({
          stats: {
            ...(user?.stats || {}),
            is_eligible: evaluation.isEligible,
            next_eligible_date: evaluation.nextEligibleDate || undefined,
          },
        }),
      );

      try {
        if (answers.recent_donation === true) {
          const targetDate =
            isVerifiedDonationActive && verifiedLastDonation
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
      } catch (err) {
        console.log("Could not sync last_donated_at to backend:", err);
      }

      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      setOriginalAnswers(answers);
      setResultModalVisible(true);
    } catch (err) {
      console.error("Error saving questionnaire:", err);
      Alert.alert(
        currentLang === "ur" ? "خرابی" : "Error",
        currentLang === "ur"
          ? "اسکریننگ محفوظ کرنے میں مسئلہ پیش آیا۔ دوبارہ کوشش کریں۔"
          : "Failed to update screening. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    setResultModalVisible(false);

    if (isEditing || returnTo) {
      navigation.goBack();
    } else {
      dispatch(updateUser({ is_onboarded: true, has_completed_screening: true }));
      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.MAIN_FLOW }],
      });
    }
  };

  const handleSkip = async () => {
    if (isEditing) {
      navigation.goBack();
    } else {
      const dob = user?.dob || user?.date_of_birth;
      const defaultEval = evaluateDonorEligibility({}, dob, verifiedLastDonation);
      await saveStoredEligibility(defaultEval, user?.id);
      dispatch(updateUser({ is_onboarded: true, has_completed_screening: true }));
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
            onBackPress={handleBack}
            hasBorder
            rightComponent={
              <TouchableOpacity
                onPress={handleContinue}
                disabled={isSubmitting}
                activeOpacity={0.7}
                style={{
                  paddingHorizontal: scale(10),
                  paddingVertical: verticalScale(6),
                }}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <AppText bold FONT_13 style={{ color: colors.primary }}>
                    {currentLang === "ur" ? "محفوظ کریں" : "Save"}
                  </AppText>
                )}
              </TouchableOpacity>
            }
          />
        ) : undefined
      }
    >
      {isInitializing ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.headerRow}>
          <AppText bold FONT_20 style={styles.title}>
            {currentLang === "ur" ? "ڈونر سوالنامہ" : "Questionnaires"}
          </AppText>
        </View>

        <AppText regular FONT_12 style={styles.subtitle}>
          {currentLang === "ur"
            ? "خون کا عطیہ دینے کے لیے درج ذیل سوالنامے کو پُر کریں اور ڈونر بنیں۔"
            : "Fill up the following Questionnaires and become a donor"}
        </AppText>

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
          style={[styles.submitButton, isSubmitting && { opacity: 0.75 }]}
          onPress={handleContinue}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <AppText bold FONT_14 style={styles.submitButtonText}>
              {isEditing
                ? currentLang === "ur"
                  ? "اسکریننگ اپ ڈیٹ کریں (Update)"
                  : "Update Screening"
                : currentLang === "ur"
                ? "جاری رکھیں (Continue)"
                : "Continue"}
            </AppText>
          )}
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
      )}

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
