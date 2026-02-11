// Home feature exports
export { homeService } from "./services/home.service";
export { useHomeData } from "./hooks/use-home";
export { homeSearchSchema } from "./schemas/home.schema";
export type { HomeSearchData } from "./schemas/home.schema";
export type { HomeData } from "./types/home.types";

// Note: Home components (hero-section, about-section, etc.) remain in src/components/home/
// They can be moved here later if needed for better feature isolation
