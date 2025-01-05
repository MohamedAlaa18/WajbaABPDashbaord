import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemsComponent } from './items/items.component';
import { ItemsDetailsComponent } from './items-details/items-details.component';

const routes: Routes = [
  { path: '', component: ItemsComponent }, // Matches '/items'
  { path: ':id', component: ItemsDetailsComponent }, // Matches '/items/:id'
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsRoutingModule { }
