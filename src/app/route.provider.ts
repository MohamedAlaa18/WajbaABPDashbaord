import { RoutesService, eLayoutType } from '@abp/ng.core';
import { APP_INITIALIZER } from '@angular/core';

export const APP_ROUTE_PROVIDER = [
  { provide: APP_INITIALIZER, useFactory: configureRoutes, deps: [RoutesService], multi: true },
];

function configureRoutes(routesService: RoutesService) {
  return () => {
    routesService.add([
      {
        path: '/',
        name: '::Menu:Home',
        iconClass: 'fa fa-home',
        order: 1,
        layout: eLayoutType.application,
      },
      {
        path: '/items',
        name: 'Items',
        iconClass: 'fa fa-clipboard-list',
        order: 2,
        layout: eLayoutType.application,
      },
      {
        path: '/popular-today',
        name: 'Popular today',
        iconClass: 'fa fa-bolt',
        order: 3,
        layout: eLayoutType.application,
      },
      {
        path: '/dining-tables',
        name: 'Dining tables',
        iconClass: 'fa fa-bars',
        order: 4,
        layout: eLayoutType.application,
      },
      {
        path: '/pos',
        name: 'POS',
        iconClass: 'fa fa-clipboard-list',
        order: 5,
        layout: eLayoutType.application,
      },
      {
        path: '/vouchers',
        name: 'Vouchers',
        iconClass: 'fa fa-clipboard-list',
        order: 6,
        layout: eLayoutType.application,
      },
      {
        path: '/offers',
        name: 'Offers',
        iconClass: 'fa fa-clipboard-list',
        order: 7,
        layout: eLayoutType.application,
      },
      {
        path: '/user/administrators',
        name: 'Administrators',
        iconClass: 'fa fa-clipboard-list',
        order: 8,
        layout: eLayoutType.application,
      },
      {
        path: '/user/delivery-boys',
        name: 'Delivery Boys',
        iconClass: 'fa fa-clipboard-list',
        order: 9,
        layout: eLayoutType.application,
      },
      {
        path: '/user/customers',
        name: 'Customers',
        iconClass: 'fa fa-clipboard-list',
        order: 10,
        layout: eLayoutType.application,
      },
      {
        path: '/user/employees',
        name: 'Employees',
        iconClass: 'fa fa-clipboard-list',
        order: 11,
        layout: eLayoutType.application,
      },
      {
        path: '/settings',
        name: 'Settings',
        iconClass: 'fa fa-cog',
        order: 12,
        layout: eLayoutType.application,
      }
    ]);
  };
}
