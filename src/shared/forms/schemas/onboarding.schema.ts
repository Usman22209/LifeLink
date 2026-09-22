import { z } from "zod";

export const getOnboardingSchema = (t: any) =>
  z.object({
    full_name: z.string().min(3, t("errors.nameTooShort")),
    email: z.string().email(t("errors.invalidEmail")),
    phone: z.string().min(10, t("errors.invalidPhone")),
    gender: z.string().min(1, t("errors.genderRequired")),
    dob: z
      .string()
      .min(1, t("errors.dobRequired"))
      .refine(
        (val) => {
          const birthDate = new Date(val);
          if (isNaN(birthDate.getTime())) return false;
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          return age >= 18;
        },
        {
          message:
            t("errors.underageError") || "You must be at least 18 years old",
        },
      ),
    city: z.string().min(2, t("errors.cityRequired")),
    state: z.string().min(2, t("errors.stateRequired")),
    country: z.string().min(2, t("errors.countryRequired")),
    blood_group: z.string().min(1, t("errors.bloodGroupRequired")),
    last_donated_at: z.string().optional(),
    profile_image: z.string().optional(),
    confirmed_data: z.boolean().refine((val) => val === true, {
      message: t("errors.confirmRequired"),
    }),
  });

export type OnboardingFormValues = z.infer<
  ReturnType<typeof getOnboardingSchema>
>;
