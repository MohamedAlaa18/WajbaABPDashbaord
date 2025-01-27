import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  providers: [DatePipe]
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() columns: { field: string; header: string }[] = [];
  @Input() actions: {
    icon: string;
    tooltip: string;
    show: (row: any) => boolean;
    callback: (row: any) => void;
  }[] = [];

  constructor(private datePipe: DatePipe) { }

  @Output() actionTriggered = new EventEmitter<{ action: string; row: any }>();

  actionClicked(action: any, row: any) {
    action.callback(row);
    this.actionTriggered.emit({ action: action.tooltip, row });
  }

  // New method to format date
  formatDate(date: string): string | null {
    return this.datePipe.transform(date, 'mediumDate');  // 'mediumDate' gives a readable format
  }

  // Helper method to check if a value is a valid date string
  isDateString(value: any): boolean {
    if (typeof value !== 'string') return false;
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?([+-]\d{2}:\d{2}|Z)?$/.test(value);
  }
}
