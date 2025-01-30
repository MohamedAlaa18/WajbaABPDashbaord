import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OffersComponent } from './offers/offers.component';
import { OffersDetailsComponent } from './offers-details/offers-details.component';

const routes: Routes = [
  { path: '', component: OffersComponent }, // Matches '/offers'
  { path: ':id', component: OffersDetailsComponent }, // Matches '/offers/:id'
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OffersRoutingModule { }
