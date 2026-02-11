// Properties feature exports
export { propertiesService } from "./services/properties.service";
export {
  useProperties,
  useProperty,
  usePropertyBySlug,
  useFeaturedProperties,
  useSimilarProperties,
  useOwnerProperty,
  useAmenities,
  useUserProperties,
  useCreateProperty,
  useUpdateProperty,
  useConvertToAdvertisement,
  useReactivateProperty,
  useDeleteProperty,
} from "./hooks/use-properties";
export {
  propertySchema,
  updatePropertySchema,
  convertToAdvertisementSchema,
  operationTypeSchema,
  finishingTypeSchema,
  propertyUseSchema,
  facadeSchema,
  marketingOptionSchema,
  obligationsSchema,
} from "./schemas/property.schema";
export type {
  Property,
  PropertyFilters,
  PropertyStatus,
  BrokerProperty,
  Amenity,
  Country,
  City,
  PropertyCategory,
  PropertyFormInput,
  ConvertToAdvertisementInput,
  OperationType,
  FinishingType,
  PropertyUse,
  Facade,
  MarketingOption,
  Obligations,
} from "./types/property.types";
export type {
  PropertyFormData,
  UpdatePropertyFormData,
  ConvertToAdvertisementFormData,
} from "./schemas/property.schema";

// Note: Estate components (estate-card, estates-filter, etc.) remain in src/components/estates/
// They can be moved here later if needed for better feature isolation
