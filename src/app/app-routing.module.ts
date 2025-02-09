import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferAFriendComponent } from './components/refer-a-friend/refer-a-friend.component';
import { SalesReportsComponent } from './components/sales-reports/sales-reports.component';
import { ItemReportsComponent } from './components/item-reports/item-reports.component';
import { LoginComponent } from './components/login/login.component';
import { MessagesComponent } from './components/messages/messages.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'settings',
    loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule),
  },
  {
    path: 'items',
    loadChildren: () => import('./modules/items/items.module').then(m => m.ItemsModule),
  },
  {
    path: 'popular-today',
    loadChildren: () => import('./modules/popular-today/popular-today.module').then(m => m.PopularTodayModule),
  },
  {
    path: 'dining-tables',
    loadChildren: () => import('./modules/dining-tables/dining-tables.module').then(m => m.DiningTablesModule),
  },
  {
    path: 'pos',
    loadChildren: () => import('./modules/pos/pos.module').then(m => m.PosModule),
  },
  {
    path: 'user',
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule),
  },
  {
    path: 'offers',
    loadChildren: () => import('./modules/offers/offers.module').then(m => m.OffersModule),
  },
  {
    path: 'vouchers',
    loadChildren: () => import('./modules/vouchers/vouchers.module').then(m => m.VouchersModule),
  },
  {
    path: 'push-notification',
    loadChildren: () => import('./modules/push-notification/push-notification.module').then(m => m.PushNotificationModule),
  },
  {
    path: 'refer-a-friend',
    component: ReferAFriendComponent,
  },
  {
    path: 'sales-reports',
    component: SalesReportsComponent,
  },
  {
    path: 'item-reports',
    component: ItemReportsComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'messages',
    component: MessagesComponent,
  },
  {
    path: 'orders',
    loadChildren: () => import('./modules/orders/orders.module').then(m => m.OrdersModule),
  },
  {
    path: 'kitchen',
    loadChildren: () => import('./modules/kitchen/kitchen.module').then(m => m.KitchenModule),
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
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule { }
