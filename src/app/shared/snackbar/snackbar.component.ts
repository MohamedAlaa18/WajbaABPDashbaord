import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarService } from 'src/app/services/Snackbar/snackbar.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {
  message: string = '';
  isVisible: boolean = false;
  isError: boolean = false;

  constructor(private snackbarService: SnackbarService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.snackbarService.setSnackbarComponent(this);
  }

  public showMessage(message: string, isError: boolean = false) {
    this.message = message;
    this.isError = isError;
    this.isVisible = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.isVisible = false;
      this.cdr.detectChanges();
    }, 3000);
  }
}
