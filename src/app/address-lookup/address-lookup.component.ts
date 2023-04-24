import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-address-lookup',
  templateUrl: './address-lookup.component.html',
  styleUrls: ['./address-lookup.component.css'],
})
export class AddressLookupComponent implements OnInit {
  tokenContractAddress = '';

  apiKey = 'Z4M71TUYY87Z18PQP57MSC1EYTI82URZ4T';
  searchQuery = false;
  searchedToken = false;
  submit = false;
  
  
  contractName: string;
  contractVerified: boolean;
  contractAge: string;
  totalSupply: number;
  burnedSupply: number;
  burnedPercentage: number;
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


  constructor(private http: HttpClient) { }

  ngOnInit(): void { }


  async searchAddress() {
    this.submit = true;
    this.searchQuery = !!this.tokenContractAddress;
    if (!this.tokenContractAddress) return;
    const foundToken = await this.fetchContractInfo();
    this.searchedToken = !!foundToken;
    if (foundToken) {
      this.fetchTotalSupply();
      this.fetchOwnerInfo();
      this.fetchMarketData();
      this.fetchWalletData();
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
    this.contractVerified = data.IsVerified;
    this.contractAge = '29 mins ago'; // Fake data, replace with actual data if available
    return true;
  }
  
  async fetchTotalSupply() {
    const totalSupplyUrl = `https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${this.tokenContractAddress}&apikey=${this.apiKey}`;
    const response = await this.http.get(totalSupplyUrl).toPromise();
    this.totalSupply = Number(response['result']) / 1e18;
  }

  async fetchOwnerInfo() {
    this.ownerAddress = '0x...'; // Fake data, replace with actual data if available
    this.ownerBalance = 1940; // Fake data, replace with actual data if available
  }

  async fetchMarketData() {
    this.marketCap = 55581; // Fake data, replace with actual data if available
    this.ethMarketCap = 1940; // Fake data, replace with actual data if available
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
}
