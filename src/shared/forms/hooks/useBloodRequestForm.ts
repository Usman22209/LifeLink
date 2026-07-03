import { useForm, UseFormReturn, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useTranslation from "@shared/hooks/useTranslation";
import {
  getBloodRequestSchema,
  BloodRequestFormValues,
} from "../schemas/blood-request.schema";
import { UrgencyLevel } from "@shared/interfaces/models/blood-request.interface";

export const useBloodRequestForm = (): UseFormReturn<BloodRequestFormValues> => {
  const { t } = useTranslation();

  return useForm<BloodRequestFormValues>({
    resolver: zodResolver(getBloodRequestSchema(t)) as Resolver<BloodRequestFormValues>,
    mode: "onChange",
    defaultValues: {
      patient_name: "",
      blood_group: "",
      units_required: 1,
      hospital_name: "",
      hospital_address: "",
      city_id: "",
      state: "",
      urgency: UrgencyLevel.NORMAL,
      contact_number: "",
      description: "",
      required_date: "",
    },
  });
};
