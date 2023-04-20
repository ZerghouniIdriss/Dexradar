import { Component, OnInit } from '@angular/core';
import { DataService } from '../data-service.service';
import { TokenData } from '../token-data.interface';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
 
  searchedToken: TokenData | null = null;
  searchQuery: string = '';

  constructor(private dataService: DataService) {}
  
  ngOnInit() {}

  searchToken() {
    this.searchedToken = this.dataService.searchToken(this.searchQuery);
  }
}
