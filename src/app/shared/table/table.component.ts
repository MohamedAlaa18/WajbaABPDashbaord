import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  providers: [DatePipe]
})
export class TableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: { field: string; header: string }[] = [];
  @Input() actions: {
    icon: string;
    tooltip: string;
    show: (row: any) => boolean;
    callback: (row: any) => void;
  }[] = [];

  constructor(
    private datePipe: DatePipe,
    private router: Router
  ) { }

  @Output() actionTriggered = new EventEmitter<{ action: string; row: any }>();

  isUserRoute: boolean = false;

  ngOnInit() {
    this.checkUserRoute();
    this.router.events.subscribe(() => {
      this.checkUserRoute();
    });
  }

  private checkUserRoute() {
    const url = this.router.url;
    this.isUserRoute = /^\/user\/\d+$/.test(url) || /^\/items\/\d+$/.test(url) || /^\/offers\/\d+$/.test(url);
  }

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
