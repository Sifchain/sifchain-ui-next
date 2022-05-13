import { useQuery } from "react-query";
import useQueryClient from "~/hooks/useQueryClient";

export default function usePoolsQuery() {
  const { data: client, isSuccess } = useQueryClient();
  return useQuery("pools", () => client?.clp.getPools({}), {
    enabled: isSuccess,
  });
}
