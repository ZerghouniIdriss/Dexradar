export interface TokenData {
  name: string;
  ticker: string;
  address: string;
  freshWallets: number;
  dormantWallets: number;
  initialLiquidityPool: number;
  initialLiquidityPoolUsd: number;
  addedLiquidityPool: number;
  addedLiquidityPoolUsd: number;
  currentLiquidityPool: number;
  currentLiquidityPoolUsd: number;
  totalBurntSupply: number;
  holdersAbove20k: number;
  whaleWallets: number;
  topHolders: Holder[];
}

export interface Holder {
  rank: number;
  url: string;
  holdingsPercent: number;
  holdingTime: string;
  currentValue?: number;
  totalFunds: number;
}

export interface TopHolderResponse {
  Rank: number;
  Address: string;
  Quantity: string;
  Percentage: string;
  Value: string;
}