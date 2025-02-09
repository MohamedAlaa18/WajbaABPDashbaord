import { CommonModule, formatDate } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PushNotificationsService, WajbaUserService } from '@proxy/controllers';
import { CreatePushNotificationDto, UpdatePushNotificationDto } from '@proxy/dtos/push-notification-contract';
import { GetUserListDto, WajbaUserDto } from '@proxy/dtos/wajba-users-contract';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { Base64Service } from 'src/app/services/base64/base64.service';
import { IconsComponent } from 'src/app/shared/icons/icons.component';


@Component({
  selector: 'app-add-push-notification',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent, NgSelectModule],
  templateUrl: './add-push-notification.component.html',
  styleUrl: './add-push-notification.component.scss'
})
export class AddPushNotificationComponent implements OnInit{
  @Input() isOpen: boolean = false;
  @Input() notification: UpdatePushNotificationDto | null = null;
  @Output() close = new EventEmitter<void>();

  users: WajbaUserDto[] = [];
  roles: any[] = [];
  pushNotificationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private pushNotificationsService: PushNotificationsService,
    private wajbaUserService: WajbaUserService,
    private afterActionService: AfterActionService,
    private base64Service: Base64Service,
  ) {
    this.pushNotificationForm = this.fb.group({
      id: [this.notification?.id],
      roleId: [null],
      userId: ['', Validators.required],
      title: ['', Validators.required],
      date: ['',],
      description: [''],
      imageUrl: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadUsers();

    if (this.notification) {
      this.populateForm(this.notification);
    }
  }

  populateForm(notification: UpdatePushNotificationDto) {
    this.pushNotificationForm.patchValue({
      id: notification.id,
      title: notification.title,
      roleId: notification.roleId,
      userId: notification.userId,
      date: notification.date,
      description: notification.description
    });
  }

  loadUsers(): void {
    const defaultInput: GetUserListDto = {
      skipCount: 0,
      maxResultCount: undefined,
    };

    this.wajbaUserService.getWajbaUserByInput(defaultInput).subscribe({
      next: (response) => {
        console.log(response);
        this.users = response.items;
      },
      error: (err) => {
        console.error('Error loading users:', err);
      },
    });
  }

  loadRole(userId: number): void {
    this.wajbaUserService.getrolesbyuseridById(userId).subscribe({
      next: (response) => {
        console.log(response);
        this.roles = response.data.items;
      },
      error: (err) => {
        console.error('Error loading users:', err);
      },
    });
  }

  onUserSelect() {
    const selectedUserId = this.pushNotificationForm.get('userId')?.value;
    if (selectedUserId) {
      this.loadRole(selectedUserId);
    }
  }

  formatDateForInput(dateString: string | null): string | null {
    if (!dateString) {
      return null;
    }
    // Use `formatDate` to format the date to 'yyyy-MM-dd'
    return formatDate(dateString, 'yyyy-MM-dd', 'en-US');
  }

  closeModal() {
    this.close.emit();
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Use Base64Service to convert the file to a Base64 string
      this.base64Service.convertToBase64(file).then(base64Content => {
        this.pushNotificationForm.patchValue({
          imageUrl: {
            fileName: file.name,
            base64Content: base64Content,
          },
        });
      }).catch(error => {
        console.error("Error converting file to Base64:", error);
      });
    }
  }

  submitForm(): void {
    if (this.pushNotificationForm.valid) {
      let formValue: CreatePushNotificationDto | UpdatePushNotificationDto;

      // Determine whether it's an update or create operation
      if (this.pushNotificationForm.value.id) {
        formValue = this.pushNotificationForm.value as UpdatePushNotificationDto;
      } else {
        formValue = this.pushNotificationForm.value as CreatePushNotificationDto;
      }

      console.log(formValue)

      if (this.notification) {
        // Update existing voucher
        this.pushNotificationsService.updateByDto(formValue as UpdatePushNotificationDto).subscribe(
          response => {
            console.log(response);
            this.closeModal();
            this.afterActionService.reloadCurrentRoute();
          },
          error => {
            console.error(error);
          }
        );
      } else {
        // Create a new voucher
        this.pushNotificationsService.createByPushNotificationDto(formValue as CreatePushNotificationDto).subscribe(
          response => {
            console.log(response);
            this.closeModal();
            this.afterActionService.reloadCurrentRoute();
          },
          error => {
            console.error(error);
          }
        );
      }
    } else {
      // Mark all form controls as touched to trigger validation messages
      this.pushNotificationForm.markAllAsTouched();
    }
  }
}
