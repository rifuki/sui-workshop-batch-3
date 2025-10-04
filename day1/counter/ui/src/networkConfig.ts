import { createNetworkConfig } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";

export const { networkConfig, useNetworkVariable } = createNetworkConfig({
  testnet: {
    url: getFullnodeUrl("testnet"),
    variables: {
      packageId:
        "0x87114bacd0d0e9378a9866f894d6a235c59a4bd96bdfba1de390ba27e05d8172",
    },
  },
});
