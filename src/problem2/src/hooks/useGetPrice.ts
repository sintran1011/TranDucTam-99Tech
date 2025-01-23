import { useQuery } from "@tanstack/react-query";

import { toast } from "react-toastify";
import apiClient from "@/agent/apiClient";
import { TokenListResponse } from "@/types/type.common";

const useGetWorkpace = () => {
  const query = useQuery({
    queryKey: ["tokenPrice"],
    queryFn: async () => {
      try {
        const res: { data: TokenListResponse[] } = await apiClient.get(
          "prices.json"
        );
        if (res) return res.data;
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    select(data) {
      const removeDuplicate = new Set(data?.map((item) => item.currency));
      const priceFormat = (data || []).reduce(
        (acc: Record<string, number>, item) => {
          acc[item.currency] = item.price;
          return acc;
        },
        {}
      );
      if (data)
        return {
          priceList: priceFormat,
          tokenList: Array.from(removeDuplicate),
        };
    },
  });
  return query;
};

export default useGetWorkpace;
