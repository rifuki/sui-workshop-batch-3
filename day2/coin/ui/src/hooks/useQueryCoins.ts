import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";

import { COIN_TYPE } from "@/constants/contract";
import { useQuery } from "@tanstack/react-query";

export const queryKeyQueryCoins = ["queryCoins"];

export default function useQueryCoins() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: queryKeyQueryCoins,
    queryFn: async () => {
      if (!currentAccount?.address) throw new Error("No connected account");

      const response = await suiClient.getCoins({
        owner: currentAccount.address,
        coinType: COIN_TYPE,
      });

      return response.data;
    },
    enabled: !!currentAccount,
  });
}
