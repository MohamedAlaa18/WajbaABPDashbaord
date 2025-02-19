import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IconsComponent } from 'src/app/shared/icons/icons.component';
import { SidebarService } from 'src/app/services/Sidebar/sidebar.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [IconsComponent, CommonModule, RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent implements OnInit {
  isSidebarOpen = false;
  isLoginPage = false;

  constructor(
    private router: Router,
    private sidebarService: SidebarService,
  ) { }

  // List of menu items with headers
  menuItems = [
    { type: 'link', name: 'Dashboard', iconName: 'dashboard', path: '/dashboard' },
    { type: 'link', name: 'Items', iconName: 'items', path: '/items' },
    { type: 'link', name: 'Popular today', iconName: 'popular', path: '/popular-today' },
    { type: 'link', name: 'Dining Tables', iconName: 'tables', path: '/dining-tables' },
    { type: 'header', name: 'POS Orders' },
    { type: 'link', name: 'Pos', iconName: 'pos', path: '/pos' },
    { type: 'link', name: 'Orders', iconName: 'items', path: '/orders' },
    { type: 'header', name: 'Promo' },
    { type: 'link', name: 'Vouchers', iconName: 'vouchers', path: '/vouchers' },
    { type: 'link', name: 'Offers', iconName: 'offers', path: '/offers' },
    { type: 'link', name: 'Points', iconName: 'points', path: '/points' },
    { type: 'link', name: 'Refer a friend', iconName: 'ReferAFriend', path: '/refer-a-friend' },
    { type: 'header', name: 'Kitchen' },
    { type: 'link', name: 'Kitchen', iconName: 'kitchen', path: '/kitchen' },
    { type: 'header', name: 'Communications' },
    { type: 'link', name: 'Push notification', iconName: 'notification', path: '/push-notification' },
    { type: 'link', name: 'Messages', iconName: 'massages', path: '/messages' },
    // { type: 'link', name: 'Subscribers', iconName: 'subscribers', path: '/subscribers' },
    { type: 'header', name: 'Users' },
    { type: 'link', name: 'Administrators', iconName: 'administrators', path: '/user/administrators' },
    { type: 'link', name: 'Delivery Boys', iconName: 'deliveryBoys', path: '/user/delivery-boys' },
    { type: 'link', name: 'Customers', iconName: 'customers', path: '/user/customers' },
    { type: 'link', name: 'Employees', iconName: 'employees', path: '/user/employees' },
    { type: 'header', name: 'Accounts' },
    { type: 'link', name: 'Transactions', iconName: 'transactions', path: '/transactions' },
    { type: 'header', name: 'Reports' },
    { type: 'link', name: 'Sales reports', iconName: 'salesReports', path: '/sales-reports' },
    { type: 'link', name: 'Item reports', iconName: 'itemReports', path: '/item-reports' },
    // { type: 'link', name: 'Credit balance report', iconName: 'creditBalanceReport', path: '/creditBalanceReport' },
    { type: 'header', name: 'Setup' },
    { type: 'link', name: 'Settings', iconName: 'settings', path: '/settings' },
  ];

  ngOnInit(): void {
    this.sidebarService.getSidebarState().subscribe((isOpen) => {
      this.isSidebarOpen = isOpen;
    });

    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: any) => {
      this.isLoginPage = event.url === '/login';
    });
  }

  route(): string {
    return this.router.url;
  }

  isPosRoute(): boolean {
    // return this.router.url === '/pos';
    return false;
  }

  isActive(path: string): boolean {
    // Check for exact match or contains match
    return this.router.url === path ||
      this.router.url.startsWith(path + '/') ||
      this.router.url.includes(path + '?');
  }

  handleLinkClick(): void {
    if (window.innerWidth < 1035) {
      this.sidebarService.toggleSidebar();
    }
  }
}
