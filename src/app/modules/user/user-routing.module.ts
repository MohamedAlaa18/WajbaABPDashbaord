import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { UserDetailsComponent } from './user-details/user-details.component';

const routes: Routes = [
  { path: 'administrators', component: UserComponent }, // Matches '/user/administrators'
  { path: 'delivery-boys', component: UserComponent }, // Matches '/user/delivery-boys'
  { path: 'customers', component: UserComponent }, // Matches '/user/customers'
  { path: 'employees', component: UserComponent }, // Matches '/user/employees'
  { path: ':id', component: UserDetailsComponent }, // Matches '/user/:id'
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
