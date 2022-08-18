import { useQuery } from "react-query";
import { useSifStargateClient } from "./useSifStargateClient";

const useCurrentBlockHeight = () => {
  const { data: sifStargateClient } = useSifStargateClient();

  return useQuery("current-block-height", () => sifStargateClient!.getHeight(), {
    enabled: sifStargateClient !== undefined,
  });
};

export default useCurrentBlockHeight;
