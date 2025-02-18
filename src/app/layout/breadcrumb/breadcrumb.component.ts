import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';

interface Breadcrumb {
  name: string;
  link: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];
  showBreadcrumb = true;

  constructor(
    private router: Router,
    private afterActionService: AfterActionService
  ) { }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.generateBreadcrumbs();

        // Add this check
        const currentUrl = this.router.url;
        this.showBreadcrumb = !['/dashboard', '/login', '/kitchen'].includes(currentUrl);
      });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.generateBreadcrumbs();
      });
  }

  private generateBreadcrumbs(): Breadcrumb[] {
    const urlSegments = this.router.url.split('/').filter(segment => segment);
    let breadcrumbPath = '';

    return urlSegments.map(segment => {
      // Check if segment is a number and replace it with "View"
      const formattedSegment = this.isNumber(segment) ? 'view' : segment;
      breadcrumbPath += `/${segment}`; // Maintain correct route path

      return {
        name: this.formatBreadcrumbName(formattedSegment),
        link: breadcrumbPath
      };
    });
  }

  private formatBreadcrumbName(segment: string): string {
    return segment
      .replace(/-/g, ' ') // Replace hyphens with spaces
      .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter
  }

  private isNumber(value: string): boolean {
    return !isNaN(Number(value));
  }

  handleBreadcrumbClick(name: string, index: number): void {
    if (
      name !== 'View' &&
      this.breadcrumbs[index + 1]?.name === 'View' &&
      this.breadcrumbs.some(breadcrumb => breadcrumb.name === 'Settings')
    ) {
      const selectedComponentName = localStorage.getItem('selectedComponentName');

      if (selectedComponentName) {
        const updatedName = selectedComponentName.replace(' Details', '');
        localStorage.setItem('selectedComponentName', updatedName);
        this.afterActionService.reloadCurrentRoute();
      }
    }
  }
}
