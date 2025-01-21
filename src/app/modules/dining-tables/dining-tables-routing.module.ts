import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiningTablesComponent } from './dining-tables/dining-tables.component';
import { DiningTablesDetailsComponent } from './dining-tables-details/dining-tables-details.component';

const routes: Routes = [
  { path: '', component: DiningTablesComponent }, // Matches '/dining-tables'
  { path: ':id', component: DiningTablesDetailsComponent }, // Matches '/dining-tables/:id'
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiningTablesRoutingModule { }
