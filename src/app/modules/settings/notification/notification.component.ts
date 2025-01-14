import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingsSidebarComponent } from "../settings-sidebar/settings-sidebar.component";
import { NotificationService } from '@proxy/controllers';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SettingsSidebarComponent],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  notificationForm: FormGroup;
  imageFile: File | null = null;
  imageFileError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
  ) {
    this.notificationForm = this.fb.group({
      vapidKey: ['', Validators.required],
      apiKey: ['', Validators.required],
      authDomain: ['', Validators.required],
      projectId: ['', Validators.required],
      storageBucket: ['', Validators.required],
      messagingSenderId: ['', Validators.required],
      appId: ['', Validators.required],
      measurementId: ['', Validators.required],
      image: ['', Validators.required]
    });
  }

  loadNotification(): void {
    // this.notificationService.getById().subscribe(
    //   (response) => {
    //     console.log(response);
    //     this.notificationForm.patchValue({
    //       name: response.data.name,
    //       email: response.data.email,
    //       iosappLink: response.data.iosappLink, // Ensure correct casing
    //       androidAPPLink: response.data.androidAPPLink, // Ensure correct casing
    //       copyrights: response.data.copyrights,
    //       googleMapKey: response.data.googleMapKey,
    //       digitAfterDecimal: response.data.quantity,
    //       currencyPosition: response.data.currencyPosition,
    //       languageSwitch: response.data.languageSwitch,
    //       defaultBranch: response.data.branchId,
    //       defaultCurrency: response.data.currencyId,
    //       defaultLanguage: response.data.languageId,
    //     });
    //   },
    //   (error) => {
    //     console.error('Error fetching company:', error);
    //   }
    // );
  }

  // Method to handle file selection and validation
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (validTypes.includes(file.type)) {
        this.imageFile = file;
        this.imageFileError = null;
      } else {
        this.imageFileError = 'Invalid file type. Please select a JPEG, PNG, or GIF image.';
        this.imageFile = null;
      }
    }
  }

  // Method to submit the form and send the notification
  sendNotification() {
    console.log(this.notificationForm)
    if (this.notificationForm.valid) {


      // Call the notification service to send the notification
      // this.notificationService.update(formData).subscribe(
      //   response => {
      //     console.log('Notification sent successfully:', response);
      //     this.notificationForm.reset();
      //   },
      //   error => {
      //     console.error('Error sending notification:', error);
      //   }
      // );
    } else {
      this.notificationForm.markAllAsTouched();
      console.error('Form is invalid. Please check the inputs.');
    }
  }
}
