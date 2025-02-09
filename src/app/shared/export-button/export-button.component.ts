import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ExportService } from 'src/app/services/export/export.service';

@Component({
  selector: 'app-export-button',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule],
  templateUrl: './export-button.component.html',
  styleUrls: ['./export-button.component.scss'],
})
export class ExportButtonComponent {
  @Input() buttonLabel: string = 'Export'; // Default button label
  @Input() buttonIcon: string = 'assets/images/export.svg'; // Default icon
  @Input() menuItems: { label: string; icon: string; action: string }[] = []; // Menu items with label, icon, and action
  @Input() tableData: any[] = []; // Data to export
  @Input() columns: { field: string; header: string }[] = []; // Table columns with keys and names
  @Input() fileName: string = 'ExportedData'; // Default file name
  @Output() menuAction = new EventEmitter<string>(); // Emit the selected action

  isMenuOpen = false;

  constructor(private exportService: ExportService) { }

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
    console.log('Exporting to XLS:', this.tableData, this.columns, this.fileName);
    this.exportService.exportTableToCsv(this.tableData, this.columns, this.fileName); // Use ExportService
  }

  printToPdf() {
    console.log('Printing to PDF:', this.tableData, this.columns, this.fileName);
    this.exportService.exportTableToPdf(this.tableData, this.columns, this.fileName); // Use ExportService
  }
}
