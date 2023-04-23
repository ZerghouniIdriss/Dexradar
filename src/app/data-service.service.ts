import { Injectable } from '@angular/core';
import { Holder, TokenData, TopHolderResponse } from './token-data.interface';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private  etherscanApiKey :string= 'Z4M71TUYY87Z18PQP57MSC1EYTI82URZ4T';
  private etherscanApiUrl :string= 'https://api.etherscan.io/api';

  constructor(private http: HttpClient) {}


  async searchToken(tokenNameOrAddress: string): Promise<TokenData | null> {
    try {
      // Check if the input is an address
      const isAddress = tokenNameOrAddress.startsWith('0x') && tokenNameOrAddress.length === 42;
  
      // First, get the token contract address by token name if not an address
      let contractAddress = tokenNameOrAddress;
      if (!isAddress) {
        const tokenByNameResponse = await this.http.get<{result: any}>(this.etherscanApiUrl, {
          params: {
            module: 'account',
            action: 'tokenlist',
            tokenname: tokenNameOrAddress,
            apiKey: this.etherscanApiKey,
          },
        }).toPromise();
  
        if (tokenByNameResponse.result && tokenByNameResponse.result.length > 0) {
          contractAddress = tokenByNameResponse.result[0].contractAddress;
        } else {
          return null;
        }
      }
  
      // Get token details from the token contract address
      const tokenDetailsResponse = await this.http.get<{result: any}>(this.etherscanApiUrl, {
        params: {
          module: 'token',
          action: 'tokeninfo',
          contractaddress: contractAddress,
          apiKey: this.etherscanApiKey,
        },
      }).toPromise();
  
      // Get top holders (example: top 10 holders)
      const topHoldersResponse = await this.http.get<{result: Holder[]}>(this.etherscanApiUrl, {
        params: {
          module: 'account',
          action: 'tokenholderlist',
          contractaddress: contractAddress,
          limit: '10', // Limit the number of holders, e.g., top 10 holders
          apiKey: this.etherscanApiKey,
        },
      }).toPromise();
  
      if (tokenDetailsResponse.result) {
        // Populate token data object
        const tokenData: TokenData = {
          name: tokenDetailsResponse.result.name,
          ticker: tokenDetailsResponse.result.symbol,
          address: contractAddress,
          freshWallets: 0, // Not available from Etherscan API, needs additional calculations
          dormantWallets: 0, // Not available from Etherscan API, needs additional calculations
          initialLiquidityPool: 0, // Not available from Etherscan API, needs additional calculations
          initialLiquidityPoolUsd: 0, // Not available from Etherscan API, needs additional calculations
          addedLiquidityPool: 0, // Not available from Etherscan API, needs additional calculations
          addedLiquidityPoolUsd: 0, // Not available from Etherscan API, needs additional calculations
          currentLiquidityPool: 0, // Not available from Etherscan API, needs additional calculations
          currentLiquidityPoolUsd: 0, // Not available from Etherscan API, needs additional calculations
          totalBurntSupply: 0, // Not available from Etherscan API, needs additional calculations
          holdersAbove20k: 0, // Not available from Etherscan API, needs additional calculations
          whaleWallets: 0, // Not available from Etherscan API,
          // Not available from Etherscan API, needs additional calculations
          topHolders: topHoldersResponse.result.map((holder: any) => {
            return {
              rank: holder.Rank,
              url: `https://etherscan.io/address/${holder.Address}`,
              holdingsPercent: parseFloat(holder.Percentage),
              holdingTime: '', // Not available from Etherscan API, needs additional calculations
              totalSpent: 0, // Not available from Etherscan API, needs additional calculations
              currentValue: parseFloat(holder.Value),
              totalFunds: 0, // Not available from Etherscan API, needs additional calculations
            };
          }),
          
                    
        };
  
        return tokenData;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching token data from Etherscan:', error);
      return null;
    }
  }  
}
  

//   fake data
//   searchToken(tokenNameOrAddress: string): TokenData | null {
//     const foundToken = this.tokens.find(
//       (t) =>
//         t.name.toLowerCase() === tokenNameOrAddress.toLowerCase() ||
//         t.address.toLowerCase() === tokenNameOrAddress.toLowerCase()
//     );

//     return foundToken ? JSON.parse(JSON.stringify(foundToken)) : null;
//   }


//   private tokens = [
//     {
//       name: 'Harry Bolz',
//       ticker: 'HARRY',
//       address: '0x0db5cf386a9fe104fe3597f013db71bfae89416c#balances',
//       freshWallets: 1,
//       dormantWallets: 0,
//       initialLiquidityPool: 0.80,
//       initialLiquidityPoolUsd: 1518.51,
//       addedLiquidityPool: 0.00,
//       addedLiquidityPoolUsd: 0.00,
//       currentLiquidityPool: 11.70,
//       currentLiquidityPoolUsd: 22201.53,
//       totalBurntSupply: 0.00,
//       holdersAbove20k: 5,
//       whaleWallets: 2,
//       topHolders: [
//         {
//           rank: 1,
//           url: '0x123456789abcdef?a=0x123456789abcdeffedcba9876543210',
//           holdingsPercent: 20.0,
//           holdingTime: '2hrs, 10mins',
//           totalSpent: 5000.0,
//           currentValue: 25000.0,
//           totalFunds: 100000.0,
//         },
//         {
//           rank: 2,
//           url: '0x123456789abcdef?a=0x0987654321fedcba',
//           holdingsPercent: 10.0,
//           holdingTime: '6hrs, 22mins',
//           totalSpent: 2500.0,
//           currentValue: 15000.0,
//           totalFunds: 50000.0,
//         },
//         {
//           rank: 3,
//           url: '0x123456789abcdef?a=0xdeadbeef12345678',
//           holdingsPercent: 7.5,
//           holdingTime: '1day, 4hrs',
//           totalSpent: 7500.0,
//           currentValue: 45000.0,
//           totalFunds: 100000.0,
//         },
//         {
//           rank: 4,
//           url: '0x123456789abcdef?a=0x1122334455667788',
//           holdingsPercent: 5.0,
//           holdingTime: '1hr, 5mins',
//           totalSpent: 1000.0,
//           currentValue: 5000.0,
//           totalFunds: 20000.0,
//         },
//         {
//           rank: 5,
//           url: '0x123456789abcdef?a=0x5555555555555555',
//           holdingsPercent: 2.5,
//           holdingTime: '1day, 1hr',
//           totalSpent: 250.0,
//           currentValue: 1250.0,
//           totalFunds: 5000.0,
//         },
//       ]
//     },
//     {
//       name: 'Moon Token',
//       ticker: 'MOON',
//       address: '0x0db5cf386a9fe104fe3597f013db71bfae89416c#balances',
//       freshWallets: 2,
//       dormantWallets: 1,
//       initialLiquidityPool: 0.50,
//       initialLiquidityPoolUsd: 3000.0,
//       addedLiquidityPool: 0.10,
//       addedLiquidityPoolUsd: 600.0,
//       currentLiquidityPool: 12.00,
//       currentLiquidityPoolUsd: 72000.0,
//       totalBurntSupply: 1.00,
//       holdersAbove20k: 4,
//       whaleWallets: 1,
//       topHolders: [
//         {
//           rank: 1,
//           url: '0x123456789abcdef?a=0x123456789abcdeffedcba9876543210',
//           holdingsPercent: 25.0,
//           holdingTime: '1hr, 5mins',
//           totalSpent: 5000.0,
//           currentValue: 25000.0,
//           totalFunds: 100000.0,
//         },
//         {
//           rank: 2,
//           url: '0x123456789abcdef?a=0x0987654321fedcba',
//           holdingsPercent: 15.0,
//           holdingTime: '3hrs, 15mins',
//           totalSpent: 3000.0,
//           currentValue: 18000.0,
//           totalFunds: 50000.0,
//         },
//         {
//           rank: 3,
//           url: '0x123456789abcdef?a=0xdeadbeef12345678',
//           holdingsPercent: 10.0,
//           holdingTime: '1day, 10hrs',
//           totalSpent: 5000.0,
//           currentValue: 30000.0,
//           totalFunds: 100000.0,
//         },
//         {
//           rank: 4,
//           url: '0x123456789abcdef?a=0x1122334455667788',
//           holdingsPercent: 7.5,
//           holdingTime: '4hrs, 22mins',
//           totalSpent: 1000.0,
//           currentValue: 7500.0,
//           totalFunds: 20000.0,
//         },
//         {
//           rank: 5,
//           url: '0x123456789abcdef?a=0x5555555555555555',
//           holdingsPercent: 5.0,
//           holdingTime: '5hrs, 30mins',
//           totalSpent: 500.0,
//           currentValue: 2500.0,
//           totalFunds: 10000.0,
//         },
//       ],
//     },
//     {
//       name: 'Galactic Coin',
//       ticker: 'GALAXY',
//       address: '0x0db5cf386a9fe104fe3597f013db71bfae89416c#balances',
//       freshWallets: 5,
//       dormantWallets: 2,
//       initialLiquidityPool: 0.40,
//       initialLiquidityPoolUsd: 8000.0,
//       addedLiquidityPool: 0.05,
//       addedLiquidityPoolUsd: 1000.0,
//       currentLiquidityPool: 8.00,
//       currentLiquidityPoolUsd: 160000.0,
//       totalBurntSupply: 2.50,
//       holdersAbove20k: 3,
//       whaleWallets: 2,
//       topHolders: [
//         {
//           rank: 1,
//           url: '0x123456789abcdef?a=0x123456789abcdeffedcba9876543210',
//           holdingsPercent: 15.0,
//           holdingTime: '10hrs, 30mins',
//           totalSpent: 10000.0,
//           currentValue: 45000.0,
//           totalFunds: 100000.0,
//         },
//         {
//           rank: 2,
//           url: '0x123456789abcdef?a=0x0987654321fedcba',
//           holdingsPercent: 12.5,
//           holdingTime: '2days, 6hrs',
//           totalSpent: 5000.0,
//           currentValue: 37500.0,
//           totalFunds: 100000.0,
//         },
//         {
//           rank: 3,
//           url: '0x123456789abcdef?a=0xdeadbeef12345678',
//           holdingsPercent: 7.5,
//           holdingTime: '3days, 18hrs',
//           totalSpent: 2500.0,
//           currentValue: 18750.0,
//           totalFunds: 50000.0,
//         },
//         {
//           rank: 4,
//           url: '0x123456789abcdef?a=0x1122334455667788',
//           holdingsPercent: 5.0,
//           holdingTime: '1hr, 50mins',
//           totalSpent: 500.0,
//           currentValue: 2500.0,
//           totalFunds: 10000.0,
//         },
//         {
//           rank: 5,
//           url: '0x123456789abcdef?a=0x5555555555555555',
//           holdingsPercent: 2.5,
//           holdingTime: '2days, 8hrs',
//           totalSpent: 1000.0,
//           currentValue: 6250.0,
//           totalFunds: 25000.0,
//         },
//       ],
//     },
//     {
//       name: 'Sonic',
//       ticker: 'SONIC',
//       address: '0x0db5cf386a9fe104fe3597f013db71bfae89416c#balances',
//       freshWallets: 3,
//       dormantWallets: 1,
//       initialLiquidityPool: 0.60,
//       initialLiquidityPoolUsd: 9000.0,
//       addedLiquidityPool: 0.15,
//       addedLiquidityPoolUsd: 2250.0,
//       currentLiquidityPool: 12.00,
//       currentLiquidityPoolUsd: 180000.0,
//       totalBurntSupply: 0.50,
//       holdersAbove20k: 4,
//       whaleWallets: 2,
//       topHolders: [
//         {
//           rank: 1,
//           url: '0x123456789abcdef?a=0x123456789abcdeffedcba9876543210',
//           holdingsPercent: 20.0,
//           holdingTime: '1hr, 30mins',
//           totalSpent: 10000.0,
//           currentValue: 60000.0,
//           totalFunds: 100000.0,
//         },
//         {
//           rank: 2,
//           url: '0x123456789abcdef?a=0x0987654321fedcba',
//           holdingsPercent: 12.5,
//           holdingTime: '1day, 2hrs',
//           totalSpent: 5000.0,
//           currentValue: 37500.0,
//           totalFunds: 100000.0,
//         },
//         {
//           rank: 3,
//           url: '0x123456789abcdef?a=0xdeadbeef12345678',
//           holdingsPercent: 10.0,
//           holdingTime: '2days, 8hrs',
//           totalSpent: 5000.0,
//           currentValue: 30000.0,
//           totalFunds: 100000.0,
//         },
//         {
//           rank: 4,
//           url: '0x123456789abcdef?a=0x1122334455667788',
//           holdingsPercent: 7.5,
//           holdingTime: '3hrs, 10mins',
//           totalSpent: 1000.0,
//           currentValue: 7500.0,
//           totalFunds: 20000.0,
//         },
//         {
//           rank: 5,
//           url: '0x123456789abcdef?a=0x5555555555555555',
//           holdingsPercent: 5.0,
//           holdingTime: '1day, 1hr',
//           totalSpent: 2000.0,
//           currentValue: 10000.0,
//           totalFunds: 50000.0,
//         },
//       ],
//     }
    
        
//     // Add more fake token data objects here
//   ];
// }
