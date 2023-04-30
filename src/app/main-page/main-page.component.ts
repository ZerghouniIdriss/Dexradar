import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Holder } from '../token-data.interface';
import { ChainId, Token, WETH, Fetcher, Route } from '@uniswap/sdk';
import { delay } from 'rxjs';

@Component({
  selector: 'main-page-lookup',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  tokenContractAddress = '0x14d4c7a788908fbbbd3c1a4bac4aff86fe1573eb';

  apiKey = 'Z4M71TUYY87Z18PQP57MSC1EYTI82URZ4T';
  coingeckoApiUrl = 'https://api.coingecko.com/api/v3';

  HarryBolz = "0x0db5cF386a9FE104Fe3597F013db71bfAe89416c";
  Saitama = "0xce3f08e664693ca792cace4af1364d5e220827b2"
  searchQuery = false;
  searchedToken = false;
  submit = false;
  isLoading = false;
  contractName: string;
  contractVerified: boolean;
  contractAge: string;
  totalSupply: number;
  burnedSupply: number;
  ownerAddress: string;
  ownerBalance: number;
  marketCapUsd: number;
  liquidity: number;
  liquidityUsd: number;
  holdersCount: number;
  freshWallets: number;
  dormantWallets: number;
  whaleWallets: number;
  dolphinWallets: number;
  fishWallets: number;
  topHolders: Holder[];
  allTokenTransferts: any[];


  //Displays
  totalSupplyDisplay: string;
  marketCapUsdDisplay: string;
  liquidityUsdDisplay: string;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.searchAddress()
  }


  async searchAddress() {
    this.isLoading = true; // Set isLoading to true at the beginning of the method
    this.submit = true;
    this.searchQuery = !!this.tokenContractAddress;
    if (!this.tokenContractAddress) {
      this.isLoading = false;
      return;
    }
    const foundToken = await this.fetchContractInfo();
    this.searchedToken = !!foundToken;
    if (foundToken) {
      await this.fetchTotalSupply();
      await this.fetchAllTokenTransfers();
      await this.fetchContractVerificationStatus(),
        await this.fetchContractAge(),
        await this.fetchBurnedSupply(),
        await this.fetchContractOwnerAndBalance(),//Return error of max 5 call per seconds
        await this.fetchTopHolders(),
        await this.fetchAllWhaleWallets(),
        await this.fetchDormantWallets(),
        await this.fetchFreshWallets(),
        await this.fetchHolderscCount()

      this.isLoading = false; // Set isLoading to false when all data are fetched

    } else {
      this.isLoading = false;
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
  async fetchContractVerificationStatus() {
    const contractVerifiedUrl = `https://api.etherscan.io/api?module=contract&action=getabi&address=${this.tokenContractAddress}&apikey=${this.apiKey}`;

    const response = await this.http.get(contractVerifiedUrl).toPromise();
    const status = response['status'];
    const result = response['result'];

    if (status === '1' && result !== 'Contract source code not verified') {
      this.contractVerified = true;
    } else {
      this.contractVerified = false;
    }
  }

  async fetchHolderscCount() {
    this.holdersCount = new Set(this.allTokenTransferts.map(transfer => transfer.from).concat(this.allTokenTransferts.map(transfer => transfer.to))).size;
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
    this.totalSupply = response['result'];
    this.totalSupplyDisplay = this.formatLargeNumber(this.totalSupply);
    return this.totalSupply;
  }

  async fetchBurnedSupply() {
    const burnAddress = '0x0000000000000000000000000000000000000000';
    const burnedSupplyUrl = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${this.tokenContractAddress}&address=${burnAddress}&apikey=${this.apiKey}`;

    const response = await this.http.get(burnedSupplyUrl).toPromise();
    this.burnedSupply = Number(response['result']) / 1e18;
  }

  async fetchContractOwnerAndBalance() {
    try {
      const txListUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${this.tokenContractAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${this.apiKey}`;
      const txListResponse = await this.http.get(txListUrl).toPromise();
      const txListData = txListResponse['result'];

      if (txListResponse['status'] === '1' && txListData.length > 0) {
        const creationTx = txListData[0];
        this.ownerAddress = creationTx.from;

        const ownerEthBalanceUrl = `https://api.etherscan.io/api?module=account&action=balance&address=${this.ownerAddress}&tag=latest&apikey=${this.apiKey}`;
        const ownerBalanceResponse = await this.http.get(ownerEthBalanceUrl).toPromise();
        const ownerBalanceData = ownerBalanceResponse['result'];

        if (ownerBalanceResponse['status'] === '1') {
          this.ownerBalance = Number(ownerBalanceData) / 1e18;
        } else {
          console.error('Error fetching owner ETH balance:', ownerBalanceResponse['message']);
        }
      } else {
        console.error('Error fetching transactions for contract:', txListResponse['message']);
      }
    } catch (error) {
      console.error('Error fetching contract Owner and Balance:', error);
    }
  }



  async fetchAllTokenTransfers() {
    let transfers = [];
    let page = 1;
    let offset = 1000;
    let moreData = true;

    while (moreData) {
      const response = await this.fetchTokenTransfers(page, offset);
      transfers = transfers.concat(response);
      page++;

      if (response.length < offset) {
        moreData = false;
      }
      await delay(50);
    }
    this.allTokenTransferts = transfers;
    return transfers;
  }

  async fetchTokenTransfers(page: number, offset: number) {
    const transfersUrl = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${this.tokenContractAddress}&page=${page}&offset=${offset}&sort=desc&apikey=${this.apiKey}`;

    const response = await this.http.get(transfersUrl).toPromise();
    const transfers = response['result'];
    if (transfers && transfers.length > 0) {
      return transfers;
    } else {
      console.error('Error fetching token transfers:', response['message']);
      return [];
    }
  }

  async fetchTopHolders() {
    const transfers = this.allTokenTransferts;
    const holdersMap = new Map<string, any>();

    const totalSupply = this.totalSupply;
    transfers.forEach((transfer) => {
      if (transfer != null && transfer.from != null && transfer.to != null) {

        const from = transfer.from;
        const to = transfer.to;
        const value = Number(transfer.value);
        const timestamp = transfer.timeStamp;

        const holderData = (address) => ({
          holdings: 0,
          holdingTime: 0,
          totalFunds: 0,
          lastUpdated: timestamp,
        });

        if (holdersMap.has(from)) {
          const data = holdersMap.get(from);
          data.holdings -= value;
          data.lastUpdated = timestamp;
          holdersMap.set(from, data);
        } else {
          const data = holderData(from);
          data.holdings -= value;
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
      }
    });

    const sortedHolders = Array.from(holdersMap.entries()).sort((a, b) => b[1].holdings - a[1].holdings);
    const topHolders = sortedHolders.slice(0, 10);

    this.topHolders = topHolders.map(([address, data], index) => ({
      rank: index + 1,
      url: address,
      holdingsPercent: parseFloat(((data.holdings / totalSupply) * 100).toFixed(2)),
      holdingTime: new Date(data.holdingTime * 1000).toISOString().substr(11, 8),

      totalFunds: data.totalFunds / 1e18,
    }));
  }

  async fetchFreshWallets() {
    const walletMap = new Map<string, { received: number; sent: number }>();

    this.allTokenTransferts.forEach(transfer => {
      if (transfer != null && transfer.from != null && transfer.to != null) {

        const from = transfer.from.toLowerCase();
        const to = transfer.to.toLowerCase();

        if (!walletMap.has(from)) {
          walletMap.set(from, { received: 0, sent: 0 });
        }

        if (!walletMap.has(to)) {
          walletMap.set(to, { received: 0, sent: 0 });
        }

        walletMap.get(from).sent += 1;
        walletMap.get(to).received += 1;
      }
    });

    let freshWallets = 0;
    walletMap.forEach(wallet => {
      if (wallet.received > 0 && wallet.sent === 0) {
        freshWallets += 1;
      }
    });

    this.freshWallets = freshWallets;
    return freshWallets;
  }
  async fetchDormantWallets() {
    const walletMap = new Map<string, number>();
    const currentTime = Math.floor(new Date().getTime() / 1000);
    const thirtyDaysInSeconds = 30 * 24 * 60 * 60;

    this.allTokenTransferts.forEach(transfer => {
      if (transfer != null && transfer.from != null && transfer.to != null) {
        const from = transfer.from.toLowerCase();
        const to = transfer.to.toLowerCase();
        const timestamp = parseInt(transfer.timeStamp);

        if (!walletMap.has(from)) {
          walletMap.set(from, timestamp);
        } else {
          const lastTxTime = walletMap.get(from);
          if (timestamp > lastTxTime) {
            walletMap.set(from, timestamp);
          }
        }

        if (!walletMap.has(to)) {
          walletMap.set(to, timestamp);
        } else {
          const lastTxTime = walletMap.get(to);
          if (timestamp > lastTxTime) {
            walletMap.set(to, timestamp);
          }
        }
      }
    });

    let dormantWallets = 0;
    walletMap.forEach(lastTxTime => {
      if (currentTime - lastTxTime > thirtyDaysInSeconds) {
        dormantWallets += 1;
      }
    });

    this.dormantWallets = dormantWallets;
    return dormantWallets;
  }

  async fetchAllWhaleWallets() {
    this.whaleWallets = await this.fetchWhaleWallets(100000);
    this.dolphinWallets = await this.fetchWhaleWallets(20000);
    this.fishWallets = await this.fetchWhaleWallets(5000);
  }

  async fetchWhaleWallets(minimumTokens) {
    const walletBalances = new Map<string, number>();

    this.allTokenTransferts.forEach(transfer => {
      if (transfer != null && transfer.from != null && transfer.to != null) {
        const from = transfer.from.toLowerCase();
        const to = transfer.to.toLowerCase();
        const value = parseInt(transfer.value);

        if (!walletBalances.has(from)) {
          walletBalances.set(from, -value);
        } else {
          walletBalances.set(from, walletBalances.get(from) - value);
        }

        if (!walletBalances.has(to)) {
          walletBalances.set(to, value);
        } else {
          walletBalances.set(to, walletBalances.get(to) + value);
        }
      }
    });

    let targetWallets = 0;
    walletBalances.forEach(balance => {
      if (balance >= minimumTokens) {
        targetWallets += 1;
      }
    });

    return targetWallets;
  }



  formatLargeNumber(num: number, decimals: number = 18): string {
    num = num / Math.pow(10, decimals);

    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(2) + 'B';
    } else if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(2) + 'M';
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(2) + 'K';
    } else {
      return num.toFixed(2);
    }
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

}
