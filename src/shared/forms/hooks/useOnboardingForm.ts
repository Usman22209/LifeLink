import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema, OnboardingFormValues } from "../schemas/onboarding.schema";

export const useOnboardingForm = (): UseFormReturn<OnboardingFormValues> => {
    return useForm<OnboardingFormValues>({
        resolver: zodResolver(onboardingSchema),
        mode: "onChange",
        defaultValues: {
            full_name: "",
            email: "",
            phone: "",
            gender: "male" as OnboardingFormValues["gender"],
            dob: "",
            city: "",
            state: "",
            country: "",
            blood_group: "",
            profile_image: "",
            confirmed_data: true,
        },
    });
};
