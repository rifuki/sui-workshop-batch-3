import { Transaction } from "@mysten/sui/transactions";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import { useNetworkVariable } from "../networkConfig";
import { queryKeyCounterObject } from "./useQueryCounterObject";

const mutateKeyCreateCounter = ["mutate", "create-counter"];

export function useMutateCreateCounter() {
  const currentAccount = useCurrentAccount();
  const packageId = useNetworkVariable("packageId");

  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutateKeyCreateCounter,
    mutationFn: async () => {
      if (!currentAccount) throw new Error("No connected account");

      const tx = new Transaction();
      const [counterObject] = tx.moveCall({
        target: `${packageId}::counter_module::create`,
        arguments: [],
      });

      tx.transferObjects([counterObject], currentAccount.address);

      const { digest } = await signAndExecute({ transaction: tx });
      const response = await suiClient.waitForTransaction({
        digest,
        options: {
          showEvents: true,
        },
      });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeyCounterObject });
    },
    onError: (error) => {
      console.error("Error creating counter object", error);
    },
  });
}
