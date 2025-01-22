import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-export-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './export-button.component.html',
  styleUrl: './export-button.component.scss',
})
export class ExportButtonComponent {
  @Input() buttonLabel: string = 'Export'; // Default button label
  @Input() buttonIcon: string = 'assets/images/export.svg'; // Default icon
  @Input() menuItems: { label: string; icon: string; action: string }[] = []; // Menu items with label, icon, and action
  @Input() tableData: any[] = []; // Data to export
  @Input() headers: string[] = []; // Table headers
  @Input() fileName: string = 'ExportedData'; // Default file name
  @Output() menuAction = new EventEmitter<string>(); // Emit the selected action

  isMenuOpen = false;

  constructor() { }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onMenuItemClick(action: string) {
    if (action === 'exportXLS') {
      this.exportToXls();
    } else if (action === 'print') {
      this.printToPdf();
    }
    this.isMenuOpen = false; // Close the menu
  }

  exportToXls() {
    console.log('Exporting to XLS:', this.tableData, this.headers, this.fileName);
    // Add XLS export logic here
  }

  printToPdf() {
    console.log('Printing to PDF:', this.tableData, this.headers, this.fileName);
    // Add PDF print logic here
  }
}
