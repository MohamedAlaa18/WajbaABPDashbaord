import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { OrdersDetailsComponent } from './orders-details/orders-details.component';

const routes: Routes = [
  { path: '', component: OrdersComponent }, // Matches '/orders'
  { path: ':id', component: OrdersDetailsComponent }, // Matches '/orders/:id'
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
