import { useState } from "react";
import { toast } from "sonner";
import { Coins, Loader2, Flame } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import useQueryCoins from "@/hooks/useQueryCoins";
import useMutateMintCoin from "@/hooks/useMutateMintCoin";
import useMutateBurnCoin from "@/hooks/useMutateBurnCoin";

export default function HomePage() {
  const [coinAmount, setCoinAmount] = useState("");
  const [burnCoinId, setBurnCoinId] = useState("");

  const {
    data: coinsData = [],
    isLoading: isLoadingCoins,
    refetch: refetchCoins,
  } = useQueryCoins();

  const { mutate: mutateMintCoin, isPending: isMutateMintCoinPending } =
    useMutateMintCoin({
      onSuccess: () => {
        toast.success("Coin minted successfully!");
        setCoinAmount("");
        refetchCoins();
      },
      onError: (error) => {
        toast.error(`Error minting coin: ${error.message}`);
      },
    });

  const { mutate: mutateBurnCoin, isPending: isMutateBurnCoinPending } =
    useMutateBurnCoin({
      onSuccess: () => {
        toast.success("Coin burned successfully!");
        setBurnCoinId("");
        refetchCoins();
      },
      onError: (error) => {
        toast.error(`Error burning coin: ${error.message}`);
      },
    });

  const handleMintCoin = () => {
    const value = Number(coinAmount);

    if (!value || isNaN(value) || value <= 0) {
      toast.error("Please enter a valid amount!");
      return;
    }

    mutateMintCoin({ amount: Number(value) });
  };

  const handleBurnCoin = () => {
    if (!burnCoinId || burnCoinId.trim() === "") {
      toast.error("Please enter a valid coin object ID!");
      return;
    }

    mutateBurnCoin({ coinObjectId: burnCoinId });
  };

  const totalBalance = coinsData.reduce(
    (acc, coin) => acc + BigInt(coin.balance),
    BigInt(0),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Mint Coin Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
              <Coins className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Mint Your Coin</h1>
            <p className="text-gray-500">
              Enter the amount of coins you want to mint
            </p>
          </div>

          {/* Mint Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Amount
              </label>
              <Input
                onChange={(e) => setCoinAmount(e.target.value)}
                value={coinAmount}
                type="number"
                placeholder="Enter amount"
                className="h-12 text-lg"
                disabled={isMutateMintCoinPending}
              />
            </div>

            <Button
              onClick={handleMintCoin}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              disabled={isMutateMintCoinPending}
            >
              {isMutateMintCoinPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Minting...
                </>
              ) : (
                "Mint Coin"
              )}
            </Button>
          </div>
        </div>

        {/* Coins List Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">Your Coins</h2>
            <p className="text-gray-500">
              Total Balance: {totalBalance.toString()} coins
            </p>
          </div>

          {isLoadingCoins ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : coinsData.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No coins found. Mint some coins first!
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {coinsData.map((coin) => (
                <div
                  key={coin.coinObjectId}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      Balance: {coin.balance}
                    </p>
                    <p className="text-xs text-gray-500 font-mono truncate">
                      ID: {coin.coinObjectId}
                    </p>
                  </div>
                  <Button
                    onClick={() => setBurnCoinId(coin.coinObjectId)}
                    size="sm"
                    variant="outline"
                    className="ml-4 text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Select
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Burn Coin Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">Burn Coin</h2>
            <p className="text-gray-500">Enter coin object ID to burn</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Coin Object ID
              </label>
              <Input
                onChange={(e) => setBurnCoinId(e.target.value)}
                value={burnCoinId}
                type="text"
                placeholder="Enter coin object ID"
                className="h-12 text-lg font-mono"
                disabled={isMutateBurnCoinPending}
              />
            </div>

            <Button
              onClick={handleBurnCoin}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 transition-all duration-200"
              disabled={isMutateBurnCoinPending}
            >
              {isMutateBurnCoinPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Burning...
                </>
              ) : (
                <>
                  <Flame className="mr-2 h-5 w-5" />
                  Burn Coin
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="text-center">
          <p className="text-xs text-gray-400">
            Workshop Demo - Sui Blockchain
          </p>
        </div>
      </div>
    </div>
  );
}
