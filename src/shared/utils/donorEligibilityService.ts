import AsyncStorage from "@react-native-async-storage/async-storage";

export interface QuestionnaireQuestion {
  id: string;
  questionEn: string;
  questionUr: string;
  expectedAnswer: boolean; // true = Yes is safe, false = No is safe
  failureReasonEn: string;
  failureReasonUr: string;
}

export const DONOR_QUESTIONS: QuestionnaireQuestion[] = [
  {
    id: "weight",
    questionEn: "Do you weigh at least 50 kg (110 lbs)?",
    questionUr: "کیا آپ کا وزن کم از کم 50 کلوگرام ہے؟",
    expectedAnswer: true,
    failureReasonEn:
      "Minimum weight requirement for blood donation is 50 kg (110 lbs) for your safety.",
    failureReasonUr:
      "آپ کی حفاظت کے لیے خون دینے کے لیے کم از کم 50 کلوگرام وزن ضروری ہے۔",
  },
  {
    id: "recent_donation",
    questionEn: "Have you donated blood within the last 90 days (3 months)?",
    questionUr: "کیا آپ نے گزشتہ 90 دنوں میں خون کا عطیہ دیا ہے؟",
    expectedAnswer: false,
    failureReasonEn:
      "A 90-day recovery interval is required between whole blood donations.",
    failureReasonUr: "خون کے دوبارہ عطیہ کے لیے 90 دن کا وقفہ ضروری ہے۔",
  },
  {
    id: "diabetes_heart",
    questionEn: "Do you have diabetes or chronic heart/lung conditions?",
    questionUr: "کیا آپ کو ذیابیطس یا دل/پھیپھڑوں کا کوئی دائمی عارضہ ہے؟",
    expectedAnswer: false,
    failureReasonEn:
      "Active chronic heart, lung, or insulin-dependent diabetes conditions preclude donation.",
    failureReasonUr:
      "دل، پھیپھڑوں یا انسولین پر منحصر ذیابیطس کے مریض خون نہیں دے سکتے۔",
  },
  {
    id: "recent_infection",
    questionEn:
      "In the last 28 days, have you had COVID-19, active fever, or severe flu?",
    questionUr:
      "کیا گزشتہ 28 دنوں میں آپ کو کووڈ-19، بخار یا شدید زکام رہا ہے؟",
    expectedAnswer: false,
    failureReasonEn:
      "You must be completely symptom-free for at least 28 days following infection.",
    failureReasonUr:
      "کسی بھی انفیکشن یا بخار کے بعد کم از کم 28 دن صحت مند رہنا ضروری ہے۔",
  },
  {
    id: "blood_infections",
    questionEn:
      "Have you ever tested positive for Hepatitis B/C, HIV, or Cancer?",
    questionUr:
      "کیا آپ کا کبھی ہیپاٹائٹس، ایچ آئی وی یا کینسر کا ٹیسٹ مثبت آیا ہے؟",
    expectedAnswer: false,
    failureReasonEn:
      "Blood safety regulations strictly defer donors with a history of blood-borne diseases.",
    failureReasonUr:
      "طبی قوانین کے مطابق ہیپاٹائٹس یا خون کے انفیکشن کے حامل افراد خون نہیں دے سکتے۔",
  },
  {
    id: "surgery_tattoo",
    questionEn:
      "In the last 6 months, have you had major surgery, new tattoo, or piercing?",
    questionUr:
      "کیا پچھلے 6 ماہ میں آپ کی بڑی سرجری یا نیا ٹیٹو/پیرسنگ ہوئی ہے؟",
    expectedAnswer: false,
    failureReasonEn:
      "A 6-month safety waiting period applies following surgery, tattooing, or piercing.",
    failureReasonUr: "سرجری، ٹیٹو یا پیرسنگ کے بعد 6 ماہ کا وقفہ لازمی ہے۔",
  },
];

export interface EligibilityResult {
  isEligible: boolean;
  reasons: string[];
  reasonsUr: string[];
  answers: Record<string, boolean>;
  evaluatedAt: string;
  nextEligibleDate?: string | null;
  userId?: string;
}

const STORAGE_KEY = "@lifelink_donor_eligibility";

export const getStorageKey = (userId?: string) => {
  return userId ? `@lifelink_donor_eligibility_${userId}` : STORAGE_KEY;
};

export const evaluateDonorEligibility = (
  answers: Record<string, boolean>,
  dob?: string | null,
  lastDonatedAt?: string | null,
): EligibilityResult => {
  const reasons: string[] = [];
  const reasonsUr: string[] = [];

  // 1. Age check
  if (dob) {
    const birthDate = new Date(dob);
    if (!isNaN(birthDate.getTime())) {
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 17) {
        reasons.push(
          `You are ${age} years old. Donors must be at least 17 years old.`,
        );
        reasonsUr.push(
          `آپ کی عمر ${age} سال ہے۔ خون دینے کے لیے کم از کم 17 سال عمر ضروری ہے۔`,
        );
      } else if (age > 65) {
        reasons.push(
          `You are ${age} years old. Donors must be 65 years or younger.`,
        );
        reasonsUr.push(
          `آپ کی عمر ${age} سال ہے۔ خون دینے کے لیے زیادہ سے زیادہ 65 سال عمر ہو سکتی ہے۔`,
        );
      }
    }
  }

  // 2. Cooldown calculation
  let nextEligibleDate: string | null = null;
  if (answers.recent_donation === true) {
    // If user answered Yes to donating in last 90 days
    const baseDate = lastDonatedAt ? new Date(lastDonatedAt) : new Date();
    const validBase = isNaN(baseDate.getTime()) ? new Date() : baseDate;
    const nextDate = new Date(validBase);
    nextDate.setDate(nextDate.getDate() + 90);
    nextEligibleDate = nextDate.toISOString().split("T")[0];
    const diffDays = Math.max(
      1,
      Math.ceil(
        (nextDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
      ),
    );
    reasons.push(
      `90-day recovery cooldown active (${diffDays} days remaining). You can donate blood again on ${nextEligibleDate}.`,
    );
    reasonsUr.push(
      `90 دن کا وقفہ جاری ہے (${diffDays} دن باقی ہیں)۔ آپ دوبارہ ${nextEligibleDate} کو خون دے سکتے ہیں۔`,
    );
  } else if (answers.recent_donation === undefined && lastDonatedAt) {
    // Only check past database donation if recent_donation question was not answered
    const lastDate = new Date(lastDonatedAt);
    if (!isNaN(lastDate.getTime())) {
      const nextDate = new Date(lastDate);
      nextDate.setDate(nextDate.getDate() + 90);
      if (new Date() < nextDate) {
        nextEligibleDate = nextDate.toISOString().split("T")[0];
        const diffDays = Math.max(
          1,
          Math.ceil(
            (nextDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
          ),
        );
        reasons.push(
          `90-day cooldown active (${diffDays} days remaining). You can donate blood again on ${nextEligibleDate}.`,
        );
        reasonsUr.push(
          `90 دن کا وقفہ جاری ہے (${diffDays} دن باقی ہیں)۔ آپ دوبارہ ${nextEligibleDate} کو خون دے سکتے ہیں۔`,
        );
      }
    }
  }

  // 3. Question checks
  DONOR_QUESTIONS.forEach((q) => {
    // recent_donation is already handled in cooldown calculation above
    if (q.id === "recent_donation") return;

    const ans = answers[q.id];
    if (ans !== undefined && ans !== q.expectedAnswer) {
      reasons.push(q.failureReasonEn);
      reasonsUr.push(q.failureReasonUr);
    }
  });

  const isEligible = reasons.length === 0;

  return {
    isEligible,
    reasons,
    reasonsUr,
    answers,
    evaluatedAt: new Date().toISOString(),
    nextEligibleDate,
  };
};

export const saveStoredEligibility = async (
  result: EligibilityResult,
  userId?: string,
): Promise<void> => {
  try {
    const payload = {
      ...result,
      userId: userId || result.userId,
    };
    const jsonStr = JSON.stringify(payload);
    if (userId) {
      await AsyncStorage.setItem(
        `@lifelink_donor_eligibility_${userId}`,
        jsonStr,
      );
    }
    await AsyncStorage.setItem(STORAGE_KEY, jsonStr);
  } catch (e) {
    console.error("Error saving eligibility to AsyncStorage:", e);
  }
};

export const getStoredEligibility = async (
  userId?: string,
): Promise<EligibilityResult | null> => {
  try {
    if (userId) {
      const userRaw = await AsyncStorage.getItem(
        `@lifelink_donor_eligibility_${userId}`,
      );
      if (userRaw) {
        return JSON.parse(userRaw);
      }
    }
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (userId && parsed?.userId && parsed.userId !== userId) {
      return null;
    }
    return parsed;
  } catch (e) {
    console.error("Error loading eligibility from AsyncStorage:", e);
    return null;
  }
};

export const hasUserCompletedScreeningOnDevice = async (
  userId?: string,
): Promise<boolean> => {
  if (!userId) return false;
  const stored = await getStoredEligibility(userId);
  return Boolean(
    stored && stored.answers && Object.keys(stored.answers).length > 0,
  );
};
