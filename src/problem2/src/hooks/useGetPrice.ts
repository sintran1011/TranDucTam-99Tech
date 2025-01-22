import { useQuery } from "@tanstack/react-query";

import { toast } from "react-toastify";
import apiClient from "@/agent/apiClient";

const useGetWorkpace = () => {
  const query = useQuery({
    queryKey: ["tokenPrice"],
    queryFn: async () => {
      try {
        const res: any = await apiClient.get("prices.json");
        if (res) return res;
      } catch (error: any) {
        toast.error(error.message);
      }
    },
    select(data) {
      return data.data
    },
  });
  return query;
};

export default useGetWorkpace;
