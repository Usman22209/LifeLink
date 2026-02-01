import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useTranslation from "@shared/hooks/useTranslation";
import { getOnboardingSchema, OnboardingFormValues } from "../schemas/onboarding.schema";


export const useOnboardingForm = (): UseFormReturn<OnboardingFormValues> => {
    const { t } = useTranslation();
    return useForm<OnboardingFormValues>({
        resolver: zodResolver(getOnboardingSchema(t)),

        mode: "onChange",
        defaultValues: {
            full_name: "",
            email: "",
            phone: "",
            gender: "male" as OnboardingFormValues["gender"],
            dob: "",
            city: "",
            state: "",
            country: "Pakistan",
            blood_group: "",
            profile_image: "",
            confirmed_data: true,
        },
    });
};
