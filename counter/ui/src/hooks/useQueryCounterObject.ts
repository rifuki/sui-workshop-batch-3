import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../networkConfig";
import { useQuery } from "@tanstack/react-query";
import type { SuiObjectResponse } from "@mysten/sui/client";

export const queryKeyCounterObject = ["counter-object"];

type CounterFields = {
  id: { id: string };
  value: number;
};

export function useQueryCounterObject() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();

  const packageId = useNetworkVariable("packageId");

  return useQuery({
    queryKey: queryKeyCounterObject,
    queryFn: async () => {
      if (!currentAccount) throw new Error("No connected account");

      const counterObjects = await suiClient.getOwnedObjects({
        owner: currentAccount.address,
        filter: { StructType: `${packageId}::counter_module::CounterObject` },
        options: {
          showContent: true,
        },
      });

      if (counterObjects.data.length === 0) return null;

      const counterObject = counterObjects.data[0];
      return getSuiObjectFields<CounterFields>(counterObject);
    },
    enabled: !!currentAccount,
  });
}

function getSuiObjectFields<T>(object: SuiObjectResponse): T | null {
  if (
    object.error ||
    !object.data ||
    object.data.content?.dataType !== "moveObject" ||
    !object.data.content.fields
  )
    return null;

  return object.data.content.fields as T;
}
