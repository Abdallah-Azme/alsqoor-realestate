import { useQuery } from "@tanstack/react-query";
import { offersService } from "../services/offers.service";

export const offersKeys = {
  all: ["offers"] as const,
  lists: () => [...offersKeys.all, "list"] as const,
  detail: (id: string | number) => [...offersKeys.all, "detail", id] as const,
};

export function useOffers() {
  return useQuery({
    queryKey: offersKeys.lists(),
    queryFn: () => offersService.getAll(),
  });
}

export function useOffer(id: string | number) {
  return useQuery({
    queryKey: offersKeys.detail(id),
    queryFn: () => offersService.getById(id),
    enabled: !!id,
  });
}
