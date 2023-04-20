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
    totalSpent: number;
    currentValue: number;
    totalFunds: number;
  }
  