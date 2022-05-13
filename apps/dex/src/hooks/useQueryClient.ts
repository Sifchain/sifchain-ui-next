import { createQueryClient } from "@sifchain/stargate";
import { useQuery } from "react-query";

export default function useQueryClient() {
  return useQuery("client", async () => {
    try {
      return await createQueryClient("https://rpc-testnet.sifchain.finance");
    } catch (error) {
      return null;
    }
  });
}
