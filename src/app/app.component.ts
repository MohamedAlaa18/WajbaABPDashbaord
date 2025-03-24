import { ReplaceableComponentsService } from '@abp/ng.core';
import { Component } from '@angular/core';
import { eThemeLeptonXComponents } from '@abp/ng.theme.lepton-x';
import { CustomLayoutComponent } from './layout/custom-layout/custom-layout.component';

@Component({
  selector: 'app-root',
  template: `
    <abp-loader-bar></abp-loader-bar>
    <abp-dynamic-layout></abp-dynamic-layout>
    <abp-internet-status></abp-internet-status>
    <app-snackbar></app-snackbar>
  `,
})
export class AppComponent {
  constructor(private replaceableComponent: ReplaceableComponentsService) {
    this.replaceableComponent.add({
      component: CustomLayoutComponent,
      key: eThemeLeptonXComponents.ApplicationLayout,
    });
  }
}
