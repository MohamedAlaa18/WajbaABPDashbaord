import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { POSComponent } from './pos/pos.component';

const routes: Routes = [
  { path: '', component: POSComponent }, // Matches '/pos'
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class POSRoutingModule { }
