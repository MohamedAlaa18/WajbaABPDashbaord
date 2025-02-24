import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingsSidebarComponent } from "../settings-sidebar/settings-sidebar.component";
import { NotificationService } from '@proxy/controllers';
import { CreateNotificationDto, GetNotificationInput } from '@proxy/dtos/notification-contract';
import { Base64Service } from 'src/app/services/base64/base64.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SettingsSidebarComponent],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit {
  notificationForm: FormGroup;
  imageFile: File | null = null;
  imageFileError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private base64Service: Base64Service,
  ) {
    // Initialize form with keys matching the API response
    this.notificationForm = this.fb.group({
      fireBasePublicVapidKey: ['', Validators.required],
      fireBaseAPIKey: ['', Validators.required],
      fireBaseAuthDomain: ['', Validators.required],
      fireBaseProjectId: ['', Validators.required],
      fireBaseStorageBucket: ['', Validators.required],
      fireBaseMessageSenderId: ['', Validators.required],
      fireBaseAppId: ['', Validators.required],
      fireBaseMeasurementId: ['', Validators.required],
      imageUrl: ['', Validators.required],
    });

  }

  ngOnInit(): void {
    this.loadNotification();
  }

  loadNotification(): void {
    const defaultInput: GetNotificationInput = {
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.notificationService.getAll(defaultInput).subscribe(
      (response) => {
        if (response.success && response.data.items.length > 0) {
          const notificationData = response.data.items[0]; // Assuming the first item is needed
          console.log(notificationData);
          this.notificationForm.patchValue({
            fireBasePublicVapidKey: notificationData.fireBasePublicVapidKey,
            fireBaseAPIKey: notificationData.fireBaseAPIKey,
            fireBaseAuthDomain: notificationData.fireBaseAuthDomain,
            fireBaseProjectId: notificationData.fireBaseProjectId,
            fireBaseStorageBucket: notificationData.fireBaseStorageBucket,
            fireBaseMessageSenderId: notificationData.fireBaseMessageSenderId,
            fireBaseAppId: notificationData.fireBaseAppId,
            fireBaseMeasurementId: notificationData.fireBaseMeasurementId,
            imageUrl: notificationData.imageUrl,
          });
        } else {
          console.warn('No notifications found.');
        }
      },
      (error) => {
        console.error('Error fetching notifications:', error);
      }
    );
  }

  // Method to handle file selection and validation
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (validTypes.includes(file.type)) {
        this.imageFile = file;
        this.imageFileError = null;
        this.notificationForm.patchValue({ imageUrl: file });
      } else {
        this.imageFileError = 'Invalid file type. Please select a JPEG, PNG, or GIF image.';
        this.imageFile = null;
      }
    }
  }

  // Method to submit the form and send the notification
  sendNotification() {
    if (this.notificationForm.valid) {
      const formValues = { ...this.notificationForm.value };
      const updateNotificationDto: CreateNotificationDto = {
        fireBasePublicVapidKey: formValues.fireBasePublicVapidKey,
        fireBaseAPIKey: formValues.fireBaseAPIKey,
        fireBaseProjectId: formValues.fireBaseProjectId,
        fireBaseAuthDomain: formValues.fireBaseAuthDomain,
        fireBaseStorageBucket: formValues.fireBaseStorageBucket,
        fireBaseMessageSenderId: formValues.fireBaseMessageSenderId,
        fireBaseAppId: formValues.fireBaseAppId,
        fireBaseMeasurementId: formValues.fireBaseMeasurementId,
        model: {
          id: 0, // Replace if an existing ID is needed for the image
          fileName: this.imageFile?.name || '', // Use the selected image's name
          base64Content: '' // Placeholder for base64 content
        }
      };

      if (this.imageFile) {
        // Convert the selected image to Base64
        this.base64Service.convertToBase64(this.imageFile).then((base64Content) => {
          updateNotificationDto.model.base64Content = base64Content;

          // Call the update API with the prepared DTO
          this.notificationService.update(updateNotificationDto).subscribe(
            (response) => {
              console.log('Notification updated successfully:', response);
            },
            (error) => {
              console.error('Error updating notification:', error);
            }
          );
        }).catch((error) => {
          console.error('Error converting image to Base64:', error);
        });
      } else {
        console.error('No image file selected. Please select an image.');
      }
    } else {
      this.notificationForm.markAllAsTouched();
      console.error('Form is invalid. Please check the inputs.');
    }
  }
}
