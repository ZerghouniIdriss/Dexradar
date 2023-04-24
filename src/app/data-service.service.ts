import { Injectable } from '@angular/core';
import { Holder, TokenData, TopHolderResponse } from './token-data.interface';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private  etherscanApiKey :string= 'Z4M71TUYY87Z18PQP57MSC1EYTI82URZ4T';
  private etherscanApiUrl :string= 'https://api-sepolia.etherscan.io/';

  constructor(private http: HttpClient) {}


//   async searchToken(tokenNameOrAddress: string): Promise<TokenData | null> {
//     try {
//       // Check if the input is an address
//       const isAddress = tokenNameOrAddress.startsWith('0x') && tokenNameOrAddress.length === 42;
  
//       // First, get the token contract address by token name if not an address
//       let contractAddress = tokenNameOrAddress;
//       if (!isAddress) {
//         const tokenByNameResponse = await this.http.get<{result: any}>(this.etherscanApiUrl, {
//           params: {
//             module: 'account',
//             action: 'tokenlist',
//             tokenname: tokenNameOrAddress,
//             apiKey: this.etherscanApiKey,
//           },
//         }).toPromise();
  
//         if (tokenByNameResponse.result && tokenByNameResponse.result.length > 0) {
//           contractAddress = tokenByNameResponse.result[0].contractAddress;
//         } else {
//           return null;
//         }
//       }
  
//       // Get token details from the token contract address
//       const tokenDetailsResponse = await this.http.get<{result: any}>(this.etherscanApiUrl, {
//         params: {
//           module: 'token',
//           action: 'tokeninfo',
//           contractaddress: contractAddress,
//           apiKey: this.etherscanApiKey,
//         },
//       }).toPromise();
  
//       // Get top holders (example: top 10 holders)
//       const topHoldersResponse = await this.http.get<{result: Holder[]}>(this.etherscanApiUrl, {
//         params: {
//           module: 'account',
//           action: 'tokenholderlist',
//           contractaddress: contractAddress,
//           limit: '10', // Limit the number of holders, e.g., top 10 holders
//           apiKey: this.etherscanApiKey,
//         },
//       }).toPromise();
  
//       if (tokenDetailsResponse.result) {
//         // Populate token data object
//         const tokenData: TokenData = {
//           name: tokenDetailsResponse.result.name,
//           ticker: tokenDetailsResponse.result.symbol,
//           address: contractAddress,
//           freshWallets: 0, // Not available from Etherscan API, needs additional calculations
//           dormantWallets: 0, // Not available from Etherscan API, needs additional calculations
//           initialLiquidityPool: 0, // Not available from Etherscan API, needs additional calculations
//           initialLiquidityPoolUsd: 0, // Not available from Etherscan API, needs additional calculations
//           addedLiquidityPool: 0, // Not available from Etherscan API, needs additional calculations
//           addedLiquidityPoolUsd: 0, // Not available from Etherscan API, needs additional calculations
//           currentLiquidityPool: 0, // Not available from Etherscan API, needs additional calculations
//           currentLiquidityPoolUsd: 0, // Not available from Etherscan API, needs additional calculations
//           totalBurntSupply: 0, // Not available from Etherscan API, needs additional calculations
//           holdersAbove20k: 0, // Not available from Etherscan API, needs additional calculations
//           whaleWallets: 0, // Not available from Etherscan API,
//           // Not available from Etherscan API, needs additional calculations
//           topHolders: topHoldersResponse.result.map((holder: any) => {
//             return {
//               rank: holder.Rank,
//               url: `https://etherscan.io/address/${holder.Address}`,
//               holdingsPercent: parseFloat(holder.Percentage),
//               holdingTime: '', // Not available from Etherscan API, needs additional calculations
//               totalSpent: 0, // Not available from Etherscan API, needs additional calculations
//               currentValue: parseFloat(holder.Value),
//               totalFunds: 0, // Not available from Etherscan API, needs additional calculations
//             };
//           }),
          
                    
//         };
  
//         return tokenData;
//       } else {
//         return null;
//       }
//     } catch (error) {
//       console.error('Error fetching token data from Etherscan:', error);
//       return null;
//     }
//   }  
// }
  

 
}
