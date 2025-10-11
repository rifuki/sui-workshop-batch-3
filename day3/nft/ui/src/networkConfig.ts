import { createNetworkConfig } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";

export const { networkConfig } = createNetworkConfig({
  testnet: {
    url: getFullnodeUrl("testnet"),
  },
});
