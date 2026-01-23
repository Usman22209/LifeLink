import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema, OnboardingFormValues } from "../schemas/onboarding.schema";

export const useOnboardingForm = () => {
    return useForm<OnboardingFormValues>({
        resolver: zodResolver(onboardingSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            gender: "male" as any,
            dob: "",
            city: "",
            state: "",
            country: "",
            blood_group: "",
            profile_image: "",
            confirmed_data: true as any,
        },
    });
};
