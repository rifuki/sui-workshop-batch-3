import { useState } from "react";
import { toast } from "sonner";
import { ImageIcon, Loader2, Flame } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import useQueryNfts from "@/hooks/useQueryNfts";
import useMutateNftMint from "@/hooks/useMutateNftMint";
import useMutateNftBurn from "@/hooks/useMutateNftBurn";

export default function HomePage() {
  const [nftName, setNftName] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [nftImageUrl, setNftImageUrl] = useState("");
  const [burnNftId, setBurnNftId] = useState("");

  const {
    data: nftsData = [],
    isLoading: isLoadingNfts,
    refetch: refetchNfts,
  } = useQueryNfts();

  const { mutate: mutateMintNft, isPending: isMutateMintNftPending } =
    useMutateNftMint({
      onSuccess: () => {
        toast.success("NFT minted successfully!");
        setNftName("");
        setNftDescription("");
        setNftImageUrl("");
        refetchNfts();
      },
      onError: (error) => {
        toast.error(`Error minting NFT: ${error.message}`);
      },
    });

  const { mutate: mutateBurnNft, isPending: isMutateBurnNftPending } =
    useMutateNftBurn({
      onSuccess: () => {
        toast.success("NFT burned successfully!");
        setBurnNftId("");
        refetchNfts();
      },
      onError: (error) => {
        toast.error(`Error burning NFT: ${error.message}`);
      },
    });

  const handleMintNft = () => {
    if (!nftName || nftName.trim() === "") {
      toast.error("Please enter NFT name!");
      return;
    }
    if (!nftDescription || nftDescription.trim() === "") {
      toast.error("Please enter NFT description!");
      return;
    }
    if (!nftImageUrl || nftImageUrl.trim() === "") {
      toast.error("Please enter NFT image URL!");
      return;
    }

    mutateMintNft({
      name: nftName,
      description: nftDescription,
      imageUrl: nftImageUrl,
    });
  };

  const handleBurnNft = () => {
    if (!burnNftId || burnNftId.trim() === "") {
      toast.error("Please enter a valid NFT object ID!");
      return;
    }

    mutateBurnNft({ nftObjectId: burnNftId });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl space-y-6">
        {/* Mint NFT Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mb-4">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Mint Your NFT</h1>
            <p className="text-gray-500">
              Create a unique digital collectible on Sui blockchain
            </p>
          </div>

          {/* Mint Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <Input
                onChange={(e) => setNftName(e.target.value)}
                value={nftName}
                type="text"
                placeholder="Enter NFT name"
                className="h-12 text-lg"
                disabled={isMutateMintNftPending}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                onChange={(e) => setNftDescription(e.target.value)}
                value={nftDescription}
                placeholder="Enter NFT description"
                className="text-lg min-h-[100px]"
                disabled={isMutateMintNftPending}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Image URL
              </label>
              <Input
                onChange={(e) => setNftImageUrl(e.target.value)}
                value={nftImageUrl}
                type="url"
                placeholder="https://example.com/image.png"
                className="h-12 text-lg"
                disabled={isMutateMintNftPending}
              />
            </div>

            <Button
              onClick={handleMintNft}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 transition-all duration-200"
              disabled={isMutateMintNftPending}
            >
              {isMutateMintNftPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Minting...
                </>
              ) : (
                "Mint NFT"
              )}
            </Button>
          </div>
        </div>

        {/* NFTs Grid Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">Your NFTs</h2>
            <p className="text-gray-500">
              Total NFTs: {nftsData.length} collectible
              {nftsData.length !== 1 ? "s" : ""}
            </p>
          </div>

          {isLoadingNfts ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : nftsData.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No NFTs found. Mint your first NFT!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nftsData.map((nft) => (
                <div
                  key={nft.objectId}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
                >
                  {/* NFT Image */}
                  <div className="aspect-square bg-gray-100 relative">
                    <img
                      src={nft.fields.image_url}
                      alt={nft.fields.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/400x400?text=NFT";
                      }}
                    />
                  </div>

                  {/* NFT Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 truncate">
                        {nft.fields.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                        {nft.fields.description}
                      </p>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1">
                      <p className="font-mono truncate">
                        ID: {nft.objectId.slice(0, 20)}...
                      </p>
                      <p className="font-mono truncate">
                        Creator: {nft.fields.creator.slice(0, 20)}...
                      </p>
                    </div>

                    <Button
                      onClick={() => setBurnNftId(nft.objectId)}
                      size="sm"
                      variant="outline"
                      className="w-full text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Select to Burn
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Burn NFT Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">Burn NFT</h2>
            <p className="text-gray-500">
              Permanently destroy an NFT (this action cannot be undone!)
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                NFT Object ID
              </label>
              <Input
                onChange={(e) => setBurnNftId(e.target.value)}
                value={burnNftId}
                type="text"
                placeholder="Enter NFT object ID or select from grid above"
                className="h-12 text-lg font-mono"
                disabled={isMutateBurnNftPending}
              />
            </div>

            <Button
              onClick={handleBurnNft}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 transition-all duration-200"
              disabled={isMutateBurnNftPending}
            >
              {isMutateBurnNftPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Burning...
                </>
              ) : (
                <>
                  <Flame className="mr-2 h-5 w-5" />
                  Burn NFT
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="text-center">
          <p className="text-xs text-gray-400">
            NFT Workshop Demo - Sui Blockchain
          </p>
        </div>
      </div>
    </div>
  );
}
