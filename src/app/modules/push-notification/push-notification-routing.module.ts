import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PushNotificationComponent } from './push-notification/push-notification.component';
import { PushNotificationDetailsComponent } from './push-notification-details/push-notification-details.component';

const routes: Routes = [
  { path: '', component: PushNotificationComponent }, // Matches '/push-notification'
  { path: ':id', component: PushNotificationDetailsComponent }, // Matches '/push-notification/:id'
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PushNotificationRoutingModule { }
