export const PACKAGE_ID: string = import.meta.env.VITE_PACKAGE_ID;
export const TREASURY_CAP_ID: string = import.meta.env.VITE_TREASURY_CAP_ID;

export const MODULE_NAME: string = import.meta.env.VITE_MODULE_NAME;
export const COIN_STRUCT_NAME: string = import.meta.env.VITE_COIN_STRUCT_NAME;

// Construct full coin type: PACKAGE_ID::MODULE_NAME::COIN_STRUCT_NAME
export const COIN_TYPE: string = `${PACKAGE_ID}::${MODULE_NAME}::${COIN_STRUCT_NAME}`;
