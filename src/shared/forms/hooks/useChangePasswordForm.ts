import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  ChangePasswordFormValues,
} from "../schemas/changePassword.schema";

export const useChangePasswordForm = () => {
  return useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onSubmit",
    reValidateMode: "onBlur",
    shouldUnregister: true,
  });
};
