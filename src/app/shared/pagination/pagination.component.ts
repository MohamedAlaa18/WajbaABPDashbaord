import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsComponent } from '../icons/icons.component';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule,IconsComponent],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() pageNumber: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  // Generate page numbers based on totalPages input
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Emit the previous page event
  onPreviousClicked(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.pageChange.emit(this.pageNumber);
    }
  }

  // Emit a specific page event
  onPageClicked(page: number): void {
    this.pageNumber = page;
    this.pageChange.emit(this.pageNumber);
  }

  // Emit the next page event
  onNextClicked(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.pageChange.emit(this.pageNumber);
    }
  }
}
