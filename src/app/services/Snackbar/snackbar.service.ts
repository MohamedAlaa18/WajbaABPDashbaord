import { Injectable } from '@angular/core';
import { SnackbarComponent } from 'src/app/shared/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private snackbar: SnackbarComponent | null = null;

  public setSnackbarComponent(snackbar: SnackbarComponent) {
    console.log('SnackbarComponent set:', snackbar);
    this.snackbar = snackbar;
  }

  public showMessage(message: string, isError: boolean = false): void {
    console.log('Snackbar message:', message, 'Error:', isError);
    if (this.snackbar) {
      this.snackbar.showMessage(message, isError);
    } else {
      console.warn('Snackbar component is not set.');
    }
  }
}
