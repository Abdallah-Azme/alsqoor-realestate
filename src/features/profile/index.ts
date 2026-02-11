// Profile feature exports
export { profileService } from "./services/profile.service";
export { useProfile, useUpdateProfile } from "./hooks/use-profile";
export { profileSchema, updateAvatarSchema } from "./schemas/profile.schema";
export type {
  ProfileFormData,
  UpdateAvatarData,
} from "./schemas/profile.schema";
export type { ProfileData, UpdateProfileRequest } from "./types/profile.types";

// Components are in the components subdirectory
// Import them directly: import { ProfileLayout } from "@/features/profile/components/profile-layout"
