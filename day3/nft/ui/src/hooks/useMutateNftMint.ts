import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import type { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation } from "@tanstack/react-query";

import { MODULE_NAME, PACKAGE_ID } from "@/constants/contract";

type UseMutateNftMintParams = {
  name: string;
  description: string;
  imageUrl: string;
};

type UseMutateNftMintResult = {
  response: SuiTransactionBlockResponse;
};

type UseMutateNftMintProps = {
  onSuccess?: (result: UseMutateNftMintResult) => void;
  onError?: (error: Error) => void;
};

export default function useMutateNftMint({
  onSuccess,
  onError,
}: UseMutateNftMintProps = {}) {
  const currentAccount = useCurrentAccount();

  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();

  return useMutation({
    mutationKey: ["mintNft"],
    mutationFn: async (params: UseMutateNftMintParams) => {
      if (!currentAccount) throw new Error("No connected account");

      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::mint`,
        arguments: [
          tx.pure.string(params.name),
          tx.pure.string(params.description),
          tx.pure.string(params.imageUrl),
        ],
      });

      const { digest } = await signAndExecute({
        transaction: tx,
      });
      const result = await suiClient.waitForTransaction({
        digest,
        options: { showEffects: true, showObjectChanges: true },
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
      console.error("Error minting NFT:", error);
    },
  });
}
