import { z } from "zod";

export const onboardingSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Invalid phone number"),
    gender: z.string().min(1, "Gender is required"),
    dob: z.string().min(1, "Date of birth is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    country: z.string().min(2, "Country is required"),
    blood_group: z.string().min(1, "Blood group is required"),
    profile_image: z.string().optional(),
    confirmed_data: z.boolean().refine((val) => val === true, {
        message: "You must confirm the information is correct",
    }),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
