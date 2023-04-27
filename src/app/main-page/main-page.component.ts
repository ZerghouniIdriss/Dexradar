import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { Holder } from '../token-data.interface';

@Component({
  selector: 'main-page-lookup',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {
  tokenContractAddress = '';

  apiKey = 'Z4M71TUYY87Z18PQP57MSC1EYTI82URZ4T';
  coingeckoApiUrl = 'https://api.coingecko.com/api/v3';

  HarryBolz = "0x0db5cF386a9FE104Fe3597F013db71bfAe89416c";
  Saitama = "0xce3f08e664693ca792cace4af1364d5e220827b2"
  searchQuery = false;
  searchedToken = false;
  submit = false;


  contractName: string;
  contractVerified: boolean;
  contractAge: string;
  totalSupply: number;
  burnedSupply: number;
  ownerAddress: string;
  ownerBalance: number;
  marketCap: number;
  ethMarketCap: number;
  liquidity: number;
  liquidityUsd: number;
  liquidityEth: number;
  holders: number;
  freshWallets: number;
  dormantWallets: number;
  whaleWallets: number;
  miniWhaleWallets: number;
  topHolders: Holder[];
  tokenPriceEth: any;
  tokenPriceUsd: any;


  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    this.searchAddress();
  }


  async searchAddress() {
    this.submit = true;
     this.searchQuery = !!this.tokenContractAddress;
    if (!this.tokenContractAddress) return;
    const foundToken = await this.fetchContractInfo();
    this.searchedToken = !!foundToken;
    if (foundToken) {
      this.fetchContractAge();
      this.fetchBurnedSupply();
      this.fetchContractOwner().then(() => {
        this.fetchOwnerBalance();
      });
      this.fetchTotalSupply().then(() => {
        this.fetchMarketData();
      });
      this.fetchWalletData();
      this.fetchTopHolders();
    }
  }
  async fetchContractInfo() {
    const contractInfoUrl = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${this.tokenContractAddress}&apikey=${this.apiKey}`;

    const response = await this.http.get(contractInfoUrl).toPromise();
    const data = response['result'][0];
    if (!data) {
      return false;
    }
    this.contractName = data.ContractName;
    return true;
  }

  async fetchContractAge() {

    const txListUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${this.tokenContractAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${this.apiKey}`;

    const response = await this.http.get(txListUrl).toPromise();
    const transactions = response['result'];
    if (transactions.length > 0) {
      const creationTx = transactions[0];
      const creationTimestamp = Number(creationTx.timeStamp) * 1000;
      this.contractAge = this.getTimeAgoString(creationTimestamp);
    } else {
      console.error('Error fetching transactions for contract:', response['message']);
    }
  }

  async fetchTotalSupply() {
    const totalSupplyUrl = `https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${this.tokenContractAddress}&apikey=${this.apiKey}`;
    const response = await this.http.get(totalSupplyUrl).toPromise();
    this.totalSupply = Number(response['result']);
  }

  async fetchBurnedSupply() {
    const burnAddress = '0x0000000000000000000000000000000000000000';
    const burnedSupplyUrl = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${this.tokenContractAddress}&address=${burnAddress}&apikey=${this.apiKey}`;

    const response = await this.http.get(burnedSupplyUrl).toPromise();
    this.burnedSupply = Number(response['result']) / 1e18;
  }

  async fetchContractOwner() {
    try {
      const txListUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${this.tokenContractAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${this.apiKey}`;
      const txListResponse = await fetch(txListUrl);
      const txListData = await txListResponse.json();

      if (txListData.status === '1' && txListData.result.length > 0) {
        const creationTx = txListData.result[0];
        this.ownerAddress = creationTx.from;
      } else {
        console.error('Error fetching transactions for contract:', txListData.message);
      }
    } catch (error) {
      console.error('Error fetching contract Owner:', error);
    }
  }




  async fetchOwnerBalance() {
    try {
      const ownerEthBalanceUrl = `https://api.etherscan.io/api?module=account&action=balance&address=${this.ownerAddress}&tag=latest&apikey=${this.apiKey}`;

      const response = await this.http.get(ownerEthBalanceUrl).toPromise();
      const data = response['result'];

      if (response['status'] === '1') {
        this.ownerBalance = Number(data) / 1e18;
      } else {
        console.error('Error fetching owner ETH balance:', response['message']);
      }
    } catch (error) {
      console.error('Error fetching owner ETH balance:', error);
    }
  }

  async fetchTokenPrice() {
    const tokenPriceUrl = `${this.coingeckoApiUrl}/simple/token_price/ethereum?contract_addresses=${this.tokenContractAddress}&vs_currencies=usd%2Ceth`;
  
    const response = await this.http.get(tokenPriceUrl).toPromise();
    const priceData = response[this.tokenContractAddress];
    if (!priceData) {
      return { usd: 0, eth: 0 };
    }
    this.tokenPriceUsd=priceData.usd
    this.tokenPriceEth=priceData.eth
    return { usd: priceData.usd, eth: priceData.eth };
  }
  
  async fetchMarketData() {
    const tokenPrice = await this.fetchTokenPrice();
    this.marketCap = tokenPrice.usd * this.totalSupply ;
    this.ethMarketCap = tokenPrice.eth * this.totalSupply ;



     this.liquidity = 5063; // Fake data, replace with actual data if available
    this.liquidityUsd = 5063; // Fake data, replace with actual data if available
    this.liquidityEth = 2.61; // Fake data, replace with actual data if available
  }



  async fetchWalletData() {
    this.holders = 243; // Fake data, replace with actual data if available
    this.freshWallets = 3; // Fake data, replace with actual data if available
    this.dormantWallets = 2; // Fake data, replace with actual data if available
    this.whaleWallets = 4; // Fake data, replace with actual data if available
    this.miniWhaleWallets = 8; // Fake data, replace with actual data if available
  }


  getTimeAgoString(timestamp: number): string {
    const now = new Date().getTime();
    const diffInSeconds = (now - timestamp) / 1000;
    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} days`;
    } else if (hours > 0) {
      return `${hours} hours`;
    } else if (minutes > 0) {
      return `${minutes} minutes`;
    } else {
      return `${Math.floor(diffInSeconds)} seconds`;
    }
  }
async fetchAllTokenTransfers() {
  let transfers = [];
  let page = 1;
  let offset=1000;
  let moreData = true;

  while (moreData) {
    const response = await this.fetchTokenTransfers(page,offset);
    transfers = transfers.concat(response);
    page++;

    if (response.length < offset) {
      moreData = false;
    }
  }

  return transfers;
}

  async fetchTokenTransfers(page: number, offset: number) {
    const transfersUrl = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${this.tokenContractAddress}&page=${page}&offset=${offset}&sort=desc&apikey=${this.apiKey}`;
  
    const response = await this.http.get(transfersUrl).toPromise();
    const transfers = response['result'];
    if (transfers.length > 0) {
      return transfers;
    } else {
      console.error('Error fetching token transfers:', response['message']);
      return [];
    }
  }

  async fetchTopHolders() {
    const transfers = await this.fetchAllTokenTransfers();
    const holdersMap = new Map<string, any>();
  
    // You need to fetch the current token price and total supply to calculate some of the properties
    const currentTokenPrice = this.tokenPriceEth; // Replace this with the actual token price
    const totalSupply = this.totalSupply; // Replace this with the actual total supply of the token
  
    transfers.forEach((transfer) => {
      const from = transfer.from;
      const to = transfer.to;
      const value = Number(transfer.value);
      const timestamp = transfer.timeStamp;
  
      const holderData = (address) => ({
        holdings: 0,
        holdingTime: 0,
        totalSpent: 0,
        totalFunds: 0,
        lastUpdated: timestamp,
      });
  
      if (holdersMap.has(from)) {
        const data = holdersMap.get(from);
        data.holdings -= value;
        data.totalSpent += value;
        data.lastUpdated = timestamp;
        holdersMap.set(from, data);
      } else {
        const data = holderData(from);
        data.holdings -= value;
        data.totalSpent += value;
        holdersMap.set(from, data);
      }
  
      if (holdersMap.has(to)) {
        const data = holdersMap.get(to);
        data.holdings += value;
        data.totalFunds += value;
        data.holdingTime += timestamp - data.lastUpdated;
        data.lastUpdated = timestamp;
        holdersMap.set(to, data);
      } else {
        const data = holderData(to);
        data.holdings += value;
        data.totalFunds += value;
        holdersMap.set(to, data);
      }
    });
  
    const sortedHolders = Array.from(holdersMap.entries()).sort((a, b) => b[1].holdings - a[1].holdings);
    const topHolders = sortedHolders.slice(0, 10); // Adjust this value to get the desired number of top holders
  
    this.topHolders = topHolders.map(([address, data], index) => ({
      rank: index + 1,
      url: address,
      holdingsPercent: (data.holdings / totalSupply) * 100,
      holdingTime: new Date(data.holdingTime * 1000).toISOString().substr(11, 8), // Convert to hh:mm:ss format
      totalSpent: data.totalSpent / 1e18,
      currentValue: (data.holdings * currentTokenPrice) / 1e18,
      totalFunds: data.totalFunds / 1e18,
    }));
  }
  
  }
   

/** 
 fetchContractAge()
 We will retrieve the transaction list for the contract address, which includes the contract creation transaction. 
 From this transaction, we can extract the timestamp and calculate the age of the contract.
*/

/*
fetchTotalSupply()
The total supply of a token contract refers to the total amount of tokens issued by the contract. 
To get this data, we can call the tokensupply API endpoint on Etherscan.
This function sends a request to the Etherscan API using the provided contract address and API key, 
then sets the totalSupply variable to the retrieved total supply value, 
divided by 1e18 to convert from the smallest token unit (e.g., wei) to the standard unit (e.g., ether).
*/

/*
fetchBurnedSupply()
To obtain this, you'll need to find the address where burned tokens are sent. 
For most ERC20 tokens, this is the "0x0000000000000000000000000000000000000000" address. 
Once you have this address, you can use the Etherscan API to fetch the balance of tokens held by that address.
*/

/*
fetchContractOwner()
represents the address that deployed the contract. You can obtain the owner's address by fetching the contract's transaction 
list and looking for the address that was involved in the contract's creation transaction.
*/

/*
fetchOwnerBalance()
The ownerBalance represents the amount of Ether the contract owner has in their wallet. 
You can obtain this information by querying the Ether balance of the contract owner's address.
*/

/*
This method fetches the token transfers and processes them to calculate the token balances for each address. 
It then sorts the addresses by their balances and returns the top holders. Keep in mind that this method might not be very 
efficient for tokens with a large number of transfers, and there might be rate limits on the Etherscan API.
*/



