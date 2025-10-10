import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import type { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation } from "@tanstack/react-query";

import { MODULE_NAME, PACKAGE_ID, TREASURY_CAP_ID } from "@/constants/contract";

type UseMutateMintCoinParams = {
  amount: number;
};

type UseMutateMintCoinResult = {
  response: SuiTransactionBlockResponse;
};

type UseMutateMintCoinProps = {
  onSuccess?: (result: UseMutateMintCoinResult) => void;
  onError?: (error: Error) => void;
};

export default function useMutateMintCoin({
  onSuccess,
  onError,
}: UseMutateMintCoinProps = {}) {
  const currentAccount = useCurrentAccount();

  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();

  return useMutation({
    mutationKey: ["mintCoin"],
    mutationFn: async (params: UseMutateMintCoinParams) => {
      if (!currentAccount) throw new Error("No connected account");

      const tx = new Transaction();
      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::mint`,
        arguments: [tx.object(TREASURY_CAP_ID), tx.pure.u64(params.amount)],
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
      console.error("Error minting coin:", error);
    },
  });
}
