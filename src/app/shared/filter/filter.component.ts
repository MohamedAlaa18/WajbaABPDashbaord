import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  @Input() filters: { [key: string]: any } = {};
  @Input() filterFields: { label: string; name: string; type: string; options?: string[] }[] = [];
  @Output() filterSubmit = new EventEmitter<{ [key: string]: any }>();
  @Output() filterClear = new EventEmitter<void>();

  ngOnInit(): void {
    console.log(this.filters);
    console.log(this.filterFields);
  }

  onSubmit() {
    this.filterSubmit.emit(this.filters);
  }

  onClear() {
    this.filters = {};
    this.filterClear.emit();
  }
}
