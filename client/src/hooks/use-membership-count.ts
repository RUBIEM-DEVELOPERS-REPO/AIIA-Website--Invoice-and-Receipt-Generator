import { useQuery } from "@tanstack/react-query";

export function useMembershipCount() {
  const { data: remainingSpots = 0, isLoading } = useQuery({
    queryKey: ["membershipCount"],
    queryFn: async () => {
      const response = await fetch("/api/membership/count");
      if (!response.ok) throw new Error("Failed to fetch count");
      const data = await response.json();
      return data.availableSpots;
    },
    refetchInterval: 5000, // Refetch every 5 seconds to keep counts in sync
  });

  return { remainingSpots, isLoading };
}
