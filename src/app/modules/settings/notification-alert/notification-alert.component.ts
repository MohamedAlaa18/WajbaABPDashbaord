import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NotificationSettingsService } from '@proxy/controllers';
import { SettingsSidebarComponent } from '../settings-sidebar/settings-sidebar.component';
import { NotificationSettingDto } from '@proxy/dtos/notifications-settings-dtoes';

@Component({
  selector: 'app-notification-alert',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SettingsSidebarComponent],
  templateUrl: './notification-alert.component.html',
  styleUrl: './notification-alert.component.scss',
})
export class NotificationAlertComponent implements OnInit {
  notificationForms: { [key: string]: FormGroup } = {};
  notificationTypes: { [key: number]: string } = { 0: 'Email', 1: 'Sms', 2: 'Push' };
  selectedNotificationType: string = 'Email';
  orderMessages: NotificationSettingDto[] = [];

  constructor(
    private fb: FormBuilder,
    private notificationSettingsService: NotificationSettingsService
  ) {
    Object.values(this.notificationTypes).forEach(type => {
      this.notificationForms[type] = this.fb.group({});
    });
  }

  ngOnInit(): void {
    this.loadNotificationSettings();
  }

  loadNotificationSettings() {
    this.notificationSettingsService.getAll().subscribe(
      (response) => {
        console.log(response); // Debugging response structure
        this.orderMessages = response.data.items; // Ensure it's an array
        this.initializeForms();
      },
      (error) => {
        console.error('Failed to load notification settings:', error);
      }
    );
  }

  initializeForms() {
    Object.values(this.notificationTypes).forEach(type => {
      const controls: any = {};
      this.orderMessages.filter(msg => this.notificationTypes[msg.notificationType] === type)
        .forEach(msg => {
          controls[msg.eventName] = [msg.isEnabled];
        });
      this.notificationForms[type] = this.fb.group(controls);
    });
  }

  selectNotificationType(type: string) {
    this.selectedNotificationType = type;
  }

  toggleMessage(event: NotificationSettingDto) {
    event.isEnabled = !event.isEnabled;
    this.notificationForms[this.selectedNotificationType].get(event.eventName)?.setValue(event.isEnabled);

    const updatedSettings = { id: event.id, isEnable: event.isEnabled };

    this.notificationSettingsService.updateNotificationSettingsBySettingsToUpdate(updatedSettings).subscribe(
      (response) => {
        console.log('Notification settings updated successfully:', response);
      },
      (error) => {
        console.error('Failed to update notification settings:', error);
      }
    );
  }
}
