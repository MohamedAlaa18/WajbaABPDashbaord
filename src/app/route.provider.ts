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
        path: '/settings',
        name: 'Settings',
        iconClass: 'fa fa-cog',
        order: 2,
        layout: eLayoutType.application,
      },
      {
        path: '/items',
        name: 'items',
        iconClass: 'fa fa-clipboard-list',
        order: 2,
        layout: eLayoutType.application,
      },
    ]);
  };
}
