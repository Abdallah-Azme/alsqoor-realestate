// Favorites feature exports
export { favoritesService } from "./services/favorites.service";
export {
  useFavorites,
  useToggleFavorite,
  useCheckFavorite,
} from "./hooks/use-favorites";
export { favoritesFilterSchema } from "./schemas/favorite.schema";
export type { FavoritesFilterData } from "./schemas/favorite.schema";
export type { Favorite, FavoriteProperty } from "./types/favorite.types";
