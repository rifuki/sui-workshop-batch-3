import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNetworkVariable } from "../networkConfig";
import { queryKeyCounterObject } from "./useQueryCounterObject";

const mutateKeyDecrementCounter = ["mutate", "decrement-counter"];

export function useMutateDecrementCounter() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const queryClient = useQueryClient();

  const packageId = useNetworkVariable("packageId");

  return useMutation({
    mutationKey: mutateKeyDecrementCounter,
    mutationFn: async (counterObject: string) => {
      if (!currentAccount) throw new Error("No connected account");

      const tx = new Transaction();
      tx.moveCall({
        target: `${packageId}::counter_module::decrement`,
        arguments: [tx.object(counterObject)],
      });

      const { digest } = await signAndExecute({ transaction: tx });
      const response = await suiClient.waitForTransaction({
        digest,
        options: {
          showEvents: true,
        },
      });

      return response;
    },
    onSuccess: (response) => {
      if (!response.events) return;

      const event = response.events[0].parsedJson as {
        new_value: number;
      };

      alert("Decrement counter success new_value: " + event.new_value);

      queryClient.invalidateQueries({ queryKey: queryKeyCounterObject });
    },
    onError: (error) => {
      console.error("Error decrement counter", error);
    },
  });
}
