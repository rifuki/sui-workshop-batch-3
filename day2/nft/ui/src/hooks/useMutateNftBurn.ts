import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import type { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation } from "@tanstack/react-query";

import { MODULE_NAME, PACKAGE_ID } from "@/constants/contract";

type UseMutateNftBurnParams = {
  nftObjectId: string;
};

type UseMutateNftBurnResult = {
  response: SuiTransactionBlockResponse;
};

type UseMutateNftBurnProps = {
  onSuccess?: (result: UseMutateNftBurnResult) => void;
  onError?: (error: Error) => void;
};

export default function useMutateNftBurn({
  onSuccess,
  onError,
}: UseMutateNftBurnProps = {}) {
  const currentAccount = useCurrentAccount();

  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();

  return useMutation({
    mutationKey: ["burnNft"],
    mutationFn: async (params: UseMutateNftBurnParams) => {
      if (!currentAccount) throw new Error("No connected account");

      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::burn`,
        arguments: [tx.object(params.nftObjectId)],
      });

      const { digest } = await signAndExecute({
        transaction: tx,
      });
      const result = await suiClient.waitForTransaction({
        digest,
        options: { showEffects: true },
      });
      if (result.effects?.status.status !== "success")
        throw new Error(
          result.effects?.status.error || "Transaction failed on-chain",
        );

      return { response: result };
    },
    onSuccess: (result) => {
      onSuccess?.(result);
    },
    onError: (error) => {
      onError?.(error);
      console.error("Error burning NFT:", error);
    },
  });
}
