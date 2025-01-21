import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PopularTodayComponent } from './popular-today/popular-today.component';

const routes: Routes = [
  { path: '', component: PopularTodayComponent }, // Matches '/popular-today'
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PopularTodayRoutingModule { }
