import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-export-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './export-button.component.html',
  styleUrl: './export-button.component.scss'
})
export class ExportButtonComponent {
  @Input() buttonLabel: string = 'Export'; // Default button label
  @Input() buttonIcon: string = 'assets/images/export.svg'; // Default icon
  @Input() menuItems: { label: string; icon: string; action: string }[] = []; // Menu items with label, icon, and action
  @Output() menuAction = new EventEmitter<string>(); // Emit the selected action

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    console.log('Menu state:', this.isMenuOpen);
  }

  onMenuItemClick(action: string) {
    this.menuAction.emit(action);
    this.isMenuOpen = false; // Close the menu
  }
}
