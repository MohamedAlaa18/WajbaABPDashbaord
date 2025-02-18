import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferAFriendComponent } from './components/refer-a-friend/refer-a-friend.component';
import { SalesReportsComponent } from './components/sales-reports/sales-reports.component';
import { ItemReportsComponent } from './components/item-reports/item-reports.component';
import { LoginComponent } from './components/login/login.component';
import { MessagesComponent } from './components/messages/messages.component';
import { authGuard } from './guardAuth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full' // No canActivate here!
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule),
    canActivate: [authGuard],
  },
  {
    path: 'items',
    loadChildren: () => import('./modules/items/items.module').then(m => m.ItemsModule),
    canActivate: [authGuard],
  },
  {
    path: 'popular-today',
    loadChildren: () => import('./modules/popular-today/popular-today.module').then(m => m.PopularTodayModule),
    canActivate: [authGuard],
  },
  {
    path: 'dining-tables',
    loadChildren: () => import('./modules/dining-tables/dining-tables.module').then(m => m.DiningTablesModule),
    canActivate: [authGuard],
  },
  {
    path: 'pos',
    loadChildren: () => import('./modules/pos/pos.module').then(m => m.PosModule),
    canActivate: [authGuard],
  },
  {
    path: 'user',
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule),
    canActivate: [authGuard],
  },
  {
    path: 'offers',
    loadChildren: () => import('./modules/offers/offers.module').then(m => m.OffersModule),
    canActivate: [authGuard],
  },
  {
    path: 'vouchers',
    loadChildren: () => import('./modules/vouchers/vouchers.module').then(m => m.VouchersModule),
    canActivate: [authGuard],
  },
  {
    path: 'points',
    loadChildren: () => import('./modules/points/points.module').then(m => m.PointsModule),
    canActivate: [authGuard],
  },
  {
    path: 'push-notification',
    loadChildren: () => import('./modules/push-notification/push-notification.module').then(m => m.PushNotificationModule),
    canActivate: [authGuard],
  },
  {
    path: 'orders',
    loadChildren: () => import('./modules/orders/orders.module').then(m => m.OrdersModule),
    canActivate: [authGuard],
  },
  {
    path: 'kitchen',
    loadChildren: () => import('./modules/kitchen/kitchen.module').then(m => m.KitchenModule),
    canActivate: [authGuard],
  },
  {
    path: 'refer-a-friend',
    component: ReferAFriendComponent,
    canActivate: [authGuard],
  },
  {
    path: 'sales-reports',
    component: SalesReportsComponent,
    canActivate: [authGuard], // Added guard to be consistent
  },
  {
    path: 'item-reports',
    component: ItemReportsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent, // No canActivate here!
  },
  {
    path: 'messages',
    component: MessagesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'account',
    loadChildren: () => import('@abp/ng.account').then(m => m.AccountModule.forLazy()),
  },
  {
    path: 'identity',
    loadChildren: () => import('@abp/ng.identity').then(m => m.IdentityModule.forLazy()),
  },
  {
    path: 'tenant-management',
    loadChildren: () =>
      import('@abp/ng.tenant-management').then(m => m.TenantManagementModule.forLazy()),
  },
  {
    path: 'setting-management',
    loadChildren: () =>
      import('@abp/ng.setting-management').then(m => m.SettingManagementModule.forLazy()),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })], // Keep as needed
  exports: [RouterModule],
})
export class AppRoutingModule { }
