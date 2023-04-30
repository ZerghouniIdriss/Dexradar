import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '$DEXR';
  searchedAddress = '';

  searchAddress(address: string) {
    this.searchedAddress = address;
  }
}
