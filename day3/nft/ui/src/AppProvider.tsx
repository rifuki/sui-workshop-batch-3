import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { networkConfig } from "./networkConfig";

import "@mysten/dapp-kit/dist/index.css";

type AppProvidersProps = {
  children: ReactNode;
};

export default function AppProvider({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>{children}</WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
