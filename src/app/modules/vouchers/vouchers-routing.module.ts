import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VouchersComponent } from './vouchers/vouchers.component';
import { VouchersDetailsComponent } from './vouchers-details/vouchers-details.component';

const routes: Routes = [
  { path: '', component: VouchersComponent }, // Matches '/vouchers'
  { path: ':id', component: VouchersDetailsComponent }, // Matches '/vouchers/:id'
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VouchersRoutingModule { }
