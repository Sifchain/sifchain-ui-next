import { invariant } from "@sifchain/ui";
import { differenceInMilliseconds, parseISO } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useSifStargateClient } from "./useSifStargateClient";

export const useBlockTimeQuery = () => {
  const { data: sifchainClients } = useSifStargateClient();

  return useQuery(
    ["current-block-time"],
    async () => {
      invariant(sifchainClients !== undefined, "sifchainClients is undefined");

      const currentHeight = await sifchainClients.getHeight();

      const currentBlock = await sifchainClients.getBlock(currentHeight);
      const prevBlock = await sifchainClients.getBlock(currentHeight - 1);

      return differenceInMilliseconds(parseISO(currentBlock.header.time), parseISO(prevBlock.header.time));
    },
    {
      enabled: sifchainClients !== undefined,
    },
  );
};
