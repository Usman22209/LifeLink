import { z } from "zod";
import { UrgencyLevel } from "@shared/interfaces/models/blood-request.interface";
import { BLOOD_GROUPS } from "@shared/constants/blood";

export const getBloodRequestSchema = (t: any) =>
  z.object({
    patient_name: z.string().optional(),
    blood_group: z
      .string()
      .min(1, t("errors.bloodGroupRequired"))
      .refine((val) => BLOOD_GROUPS.includes(val), {
        message: t("errors.invalidBloodGroup"),
      }),
    units_required: z.coerce
      .number()
      .int(t("errors.unitsMustBeInteger"))
      .min(1, t("errors.unitsMinOne")),
    hospital_name: z.string().min(3, t("errors.hospitalNameRequired")),
    hospital_address: z.string().optional(),
    city_id: z.string().optional(),
    state: z.string().optional(),
    urgency: z
      .enum([UrgencyLevel.NORMAL, UrgencyLevel.HIGH, UrgencyLevel.CRITICAL])
      .optional(),
    contact_number: z.string().optional(),
    description: z.string().max(500, t("errors.descriptionTooLong")).optional(),
    required_date: z
      .string()
      .min(1, t("errors.requiredDateRequired") || "Required date and time is required"),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  });

const _staticSchema = z.object({
  patient_name: z.string().optional(),
  blood_group: z.string(),
  units_required: z.coerce.number().int().min(1),
  hospital_name: z.string(),
  hospital_address: z.string().optional(),
  city_id: z.string().optional(),
  state: z.string().optional(),
  urgency: z
    .enum([UrgencyLevel.NORMAL, UrgencyLevel.HIGH, UrgencyLevel.CRITICAL])
    .optional(),
  contact_number: z.string().optional(),
  description: z.string().optional(),
  required_date: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type BloodRequestFormValues = z.infer<typeof _staticSchema>;
