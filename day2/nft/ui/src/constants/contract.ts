export const PACKAGE_ID: string = import.meta.env.VITE_PACKAGE_ID;
export const MODULE_NAME: string = import.meta.env.VITE_MODULE_NAME || "nft_module";
export const NFT_STRUCT_NAME: string = import.meta.env.VITE_NFT_STRUCT_NAME || "NFT";

// NFT Type for querying
export const NFT_TYPE = `${PACKAGE_ID}::${MODULE_NAME}::${NFT_STRUCT_NAME}`;
