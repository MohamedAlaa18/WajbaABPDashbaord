import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaxesComponent } from './taxes/taxes.component';

const routes: Routes = [
  { path: '', component: TaxesComponent }, // Matches '/settings/taxes'
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxesRoutingModule { }
