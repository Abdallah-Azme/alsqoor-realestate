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

      if (data?.verificationCode) {
        // Success message is shown by global handler or we can show a custom one
        toast.success("تم إنشاء الحساب بنجاح");
        const encodedMobile = encodeURIComponent(variables.mobile);
        const encodedCode = encodeURIComponent(data.verificationCode);
        router.push(
          `/auth/verfiy-otp?mobile=${encodedMobile}&code=${encodedCode}`,
        );
      } else {
        // If no verification code and status wasn't false, maybe it's a direct success?
        toast.success("تم إنشاء الحساب بنجاح");
        router.push("/auth/login");
      }
    },
    // Removed onError handler - global error handler in QueryClient will show backend errors
  });

  return mutation;
}
