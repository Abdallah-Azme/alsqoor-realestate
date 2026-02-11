// Settings feature exports
export { settingsService } from "./services/settings.service";
export { useSettings } from "./hooks/use-settings";
export {
  contactSettingsSchema,
  socialSettingsSchema,
} from "./schemas/settings.schema";
export type {
  ContactSettingsData,
  SocialSettingsData,
} from "./schemas/settings.schema";
export type { Settings } from "./types/settings.types";
