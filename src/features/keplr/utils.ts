export const getExplorerLink = (explorerUrlToTx: string, txHash: string) => {
  return explorerUrlToTx.replace("{txHash}", txHash.toUpperCase());
};
