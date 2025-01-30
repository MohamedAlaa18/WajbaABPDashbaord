import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KitchenComponent } from './kitchen/kitchen.component';

const routes: Routes = [
  { path: '', component: KitchenComponent }, // Matches '/kitchen'
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KitchenRoutingModule { }
