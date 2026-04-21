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
    onSuccess: (data, variables) => {
      // API client automatically unwraps response.data, so we receive the data object directly
      // data = { verificationCode: "6288", id: 30, name: "...", email: "...", ... }
      if (data?.status === false) {
        toast.error(data?.message || "حدث خطأ أثناء إنشاء الحساب");
        return;
      }

      const verificationCode =
        data?.verificationCode || data?.verification_code;

      // Registration should always continue through OTP flow.
      toast.success("تم إنشاء الحساب بنجاح");
      const encodedMobile = encodeURIComponent(variables.mobile);

      if (verificationCode) {
        const encodedCode = encodeURIComponent(verificationCode);
        router.push(
          `/auth/verfiy-otp?mobile=${encodedMobile}&code=${encodedCode}`,
        );
        return;
      }

      router.push(`/auth/verfiy-otp?mobile=${encodedMobile}`);
    },
    // Removed onError handler - global error handler in QueryClient will show backend errors
  });

  return mutation;
}
