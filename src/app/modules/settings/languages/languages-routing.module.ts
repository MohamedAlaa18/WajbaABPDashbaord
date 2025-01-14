import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LanguagesComponent } from './languages/languages.component';
import { LanguagesDetailsComponent } from './languages-details/languages-details.component';

const routes: Routes = [
  { path: '', component: LanguagesComponent }, // Matches '/settings/languages'
  { path: ':id', component: LanguagesDetailsComponent }, // Matches '/settings/languages/:id'
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LanguagesRoutingModule { }
