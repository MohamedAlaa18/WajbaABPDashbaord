import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '@proxy/controllers';
import { NotificationDto } from '@proxy/dtos/notification-contract';
import { SettingsSidebarComponent } from "../settings-sidebar/settings-sidebar.component";

@Component({
  selector: 'app-notification-alert',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SettingsSidebarComponent],
  templateUrl: './notification-alert.component.html',
  styleUrl: './notification-alert.component.scss'
})
export class NotificationAlertComponent implements OnInit {
  notificationForms: { [key: string]: FormGroup } = {};
  notificationTypes = ['Email', 'Sms', 'Push'];
  selectedNotificationType: string = 'Email';
  orderMessages: NotificationDto[] = [];

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
  ) {
    this.notificationTypes.forEach(type => {
      this.notificationForms[type] = this.fb.group({
        orderPending: [false],
        orderConfirmed: [false],
        orderProcessing: [false],
        orderOutForDelivery: [false],
        orderDelivered: [false],
        orderCanceled: [false],
        orderRejected: [false],
        orderReturned: [false],
        deliveryBoyAssigned: [false],
      });
    });
  }

  ngOnInit(): void {
    this.loadNotificationSettings();
  }

  loadNotificationSettings() {
    const defaultInput: PagedAndSortedResultRequestDto = {
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.notificationService.getAll(defaultInput).subscribe(
      (response) => {
        console.log(response);
        if (response && Array.isArray(response)) {
          this.orderMessages = response;
          response.forEach((setting: NotificationDto) => {
            // const notificationType = setting.notificationType;
            // if (this.notificationForms[notificationType]) {
            //   setting.events.forEach((event: NotificationEvent) => {
            //     if (this.notificationForms[notificationType].controls[event.eventName]) {
            //       this.notificationForms[notificationType].get(event.eventName)?.setValue(event.isEnabled);
            //     }
            //   });
            // }
          });
        } else {
          console.error('The response is not valid:', response);
        }
      },
      (error) => {
        console.error('Failed to load notification settings:', error);
      }
    );
  }

  // Switch between Mail, SMS, Push Notification
  selectNotificationType(type: string) {
    this.selectedNotificationType = type;
  }

  // Toggle individual message setting on or off
  toggleMessage(event: any) {
    // // Update the event's isEnabled property
    // event.isEnabled = !event.isEnabled;

    // // Prepare the updated settings array
    // const currentValue = this.notificationForms[this.selectedNotificationType].get(event.eventName)?.value;
    // this.notificationForms[this.selectedNotificationType].get(event.eventName)?.setValue(!currentValue);

    // // Prepare the data as an array of updated settings
    // const updatedSettings = [
    //   {
    //     id: event.id,
    //     isEnabled: event.isEnabled
    //   }
    // ];

    // console.log(updatedSettings);

    // // Send the updated settings to the server
    // this.notificationService.update(updatedSettings as UpdateNotificationDto).subscribe(
    //   (response) => {
    //     console.log('Notification settings updated successfully:', response);
    //   },
    //   (error) => {
    //     console.error('Failed to update notification settings:', error);
    //   }
    // );
  }
}
