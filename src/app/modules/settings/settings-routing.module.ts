import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from './company/company.component';
import { SiteComponent } from './site/site.component';
import { OrderSetupComponent } from './order-setup/order-setup.component';
import { OTPComponent } from './otp/otp.component';
import { NotificationComponent } from './notification/notification.component';
import { ThemeComponent } from './theme/theme.component';
import { TimeSlotsComponent } from './time-slots/time-slots.component';
import { FAQsComponent } from './faqs/faqs.component';

const routes: Routes = [
  { path: '', redirectTo: 'company', pathMatch: 'full' },
  { path: 'company', component: CompanyComponent },
  { path: 'site', component: SiteComponent },
  {
    path: 'branches',
    loadChildren: () => import('./branches/branches.module').then(m => m.BranchesModule),
  },
  // { path: 'email', component: EmailComponent },
  { path: 'orderSetup', component: OrderSetupComponent },
  { path: 'otp', component: OTPComponent },
  { path: 'notification', component: NotificationComponent },
  // { path: 'notificationAlert', component: NotificationAlertComponent },
  // { path: 'socialMedia', component: SocialMediaComponent },
  { path: 'faqs', component: FAQsComponent },
  // { path: 'analytics', component: AnalyticsComponent },
  { path: 'theme', component: ThemeComponent },
  { path: 'time-slots', component: TimeSlotsComponent },
  // { path: 'sliders', component: SlidersComponent },
  {
    path: 'currencies',
    loadChildren: () => import('./currencies/currencies.module').then(m => m.CurrenciesModule),
  },
  {
    path: 'item-categories',
    loadChildren: () => import('./item-categories/item-categories.module').then(m => m.ItemCategoriesModule),
  },
  {
    path: 'item-attributes',
    loadChildren: () => import('./item-attributes/item-attributes.module').then(m => m.ItemAttributesModule),
  },
  {
    path: 'languages',
    loadChildren: () => import('./languages/languages.module').then(m => m.LanguagesModule),
  },
  // { path: 'pages', component: PagesComponent },
  {
    path: 'role-and-permissions',
    loadChildren: () => import('./role-and-permissions/role-and-permissions.module').then(m => m.RoleAndPermissionsModule),
  },
  {
    path: 'taxes',
    loadChildren: () => import('./taxes/taxes.module').then(m => m.TaxesModule),
  },
  // { path: 'smsGateway', component: SmsGatewayComponent },
  // { path: 'license', component: LicenseComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
