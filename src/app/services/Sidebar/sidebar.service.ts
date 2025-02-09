import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isSidebarOpen$ = new BehaviorSubject<boolean>(true);
  private selectedComponentName$ = new BehaviorSubject<string>('');

  // Sidebar state management
  toggleSidebar(): void {
    this.isSidebarOpen$.next(!this.isSidebarOpen$.value);
  }

  getSidebarState() {
    return this.isSidebarOpen$.asObservable();
  }

  // Component name management
  setSelectedComponentName(name: string): void {
    this.selectedComponentName$.next(name);
  }

  getSelectedComponentName() {
    return this.selectedComponentName$.asObservable();
  }
}
