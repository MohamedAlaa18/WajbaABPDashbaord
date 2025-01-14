import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleComponent } from './role/role.component';
import { PermissionsComponent } from './permissions/permissions.component';

const routes: Routes = [
  { path: '', component: RoleComponent }, // Matches '/settings/role-and-permissions'
  { path: ':id', component: PermissionsComponent }, // Matches '/settings/role-and-permissions/:id'
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleAndPermissionsRoutingModule { }
