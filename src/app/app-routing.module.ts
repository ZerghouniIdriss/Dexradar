import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { AddressLookupComponent } from './address-lookup/address-lookup.component';

const routes: Routes = [
   { path: 'fake', component: MainPageComponent },
   { path: '', component: MainPageComponent },
   { path: 'real', component: AddressLookupComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
