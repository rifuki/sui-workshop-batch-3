import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import type { SuiObjectData } from "@mysten/sui/client";

import { NFT_TYPE } from "@/constants/contract";

export const queryKeyQueryNfts = ["queryNfts"];

export type NFTFields = {
  id: { id: string };
  name: string;
  description: string;
  image_url: string;
  creator: string;
};

export type NFTObject = {
  objectId: string;
  fields: NFTFields;
};

export default function useQueryNfts() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: queryKeyQueryNfts,
    queryFn: async () => {
      if (!currentAccount?.address) throw new Error("No connected account");

      const response = await suiClient.getOwnedObjects({
        owner: currentAccount.address,
        filter: { StructType: NFT_TYPE },
        options: {
          showContent: true,
          showType: true,
        },
      });

      const nfts: NFTObject[] = response.data
        .filter((item) => item.data?.content?.dataType === "moveObject")
        .map((item) => {
          const data = item.data as SuiObjectData;
          const fields = (data.content as any)?.fields as NFTFields;

          return {
            objectId: data.objectId,
            fields,
          };
        });

      return nfts;
    },
    enabled: !!currentAccount,
  });
}
