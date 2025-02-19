import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isSidebarOpen$ = new BehaviorSubject<boolean>(true);
  private selectedComponentName$ = new BehaviorSubject<string>('');
  private readonly MOBILE_BREAKPOINT = 1035;

  constructor() {
    this.checkScreenWidth();
    window.addEventListener('resize', () => this.checkScreenWidth());
  }

  // Automatically close sidebar on mobile screens
  private checkScreenWidth(): void {
    const isMobile = window.innerWidth < this.MOBILE_BREAKPOINT;
    if (isMobile && this.isSidebarOpen$.value) {
      this.isSidebarOpen$.next(false);
    }
  }

  toggleSidebar(): void {
    // Only allow toggle on desktop screens
    this.isSidebarOpen$.next(!this.isSidebarOpen$.value);
  }

  getSidebarState() {
    return this.isSidebarOpen$.asObservable();
  }

  setSelectedComponentName(name: string): void {
    this.selectedComponentName$.next(name);
  }

  getSelectedComponentName() {
    return this.selectedComponentName$.asObservable();
  }
}
