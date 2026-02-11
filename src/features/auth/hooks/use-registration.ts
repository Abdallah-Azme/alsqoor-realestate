import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { registrationService } from "../services/registration.service";
import { RegistrationRequest } from "../types/auth.types";

/**
 * Custom hook for handling user registration
 * Manages form submission, API calls, and navigation
 */
export function useRegistration() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: RegistrationRequest) => {
      switch (data.role) {
        case "owner":
          return registrationService.registerOwner(data);
        case "agent":
          return registrationService.registerAgent(data);
        case "developer":
          return registrationService.registerDeveloper(data);
        case "seeker":
          return registrationService.registerSeeker(data);
      }
    },
    onSuccess: (response, variables) => {
      if (response?.code === 200) {
        toast.success(response?.data?.message);
        const encodedMobile = encodeURIComponent(variables.mobile);
        const encodedCode = encodeURIComponent(
          response?.data?.data?.verificationCode || "",
        );
        router.push(
          `/auth/verfiy-otp?mobile=${encodedMobile}&code=${encodedCode}`,
        );
      } else {
        toast.error(response?.data?.message || "Registration failed");
      }
    },
    onError: (error) => {
      toast.error("An error occurred during registration");
      console.error(error);
    },
  });

  return mutation;
}
