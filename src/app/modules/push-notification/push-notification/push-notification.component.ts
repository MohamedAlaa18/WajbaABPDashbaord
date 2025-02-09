import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { ConfirmDeleteModalComponent } from 'src/app/shared/confirm-delete-modal/confirm-delete-modal.component';
import { TableComponent } from "../../../shared/table/table.component";
import { ExportButtonComponent } from "../../../shared/export-button/export-button.component";
import { FilterComponent } from "../../../shared/filter/filter.component";
import { PushNotificationsService, RoleService, WajbaUserService } from '@proxy/controllers';
import { AddPushNotificationComponent } from '../add-push-notification/add-push-notification.component';
import { GetUserListDto, WajbaUserDto } from '@proxy/dtos/wajba-users-contract';
import { GetPushnotificationinput, PushNotificationDto, UpdatePushNotificationDto } from '@proxy/dtos/push-notification-contract';

@Component({
  selector: 'app-push-notification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, PaginationComponent, TableComponent, ExportButtonComponent, FilterComponent],
  templateUrl: './push-notification.component.html',
  styleUrl: './push-notification.component.scss'
})
export class PushNotificationComponent implements OnInit {
  notifications: PushNotificationDto[] = [];
  users: WajbaUserDto[] = [];
  roles: any[] = [];
  isAddMode = true;
  currentPage: number = 1;
  totalPages: number = 4;

  isMenuOpen: boolean = false;
  isFilterVisible: boolean = false;

  columns = [
    { field: 'title', header: 'Title' },
    { field: 'roleName', header: 'Role' },
    { field: 'userName', header: 'User' },
    { field: 'date', header: 'Date' },
  ];

  tableData: { title: string; roleName: string; userName: string; date: string }[] = [];

  actions = [
    // {
    //   icon: 'assets/images/edit.svg',
    //   tooltip: 'Edit',
    //   show: (row: any) => true,
    //   callback: (row: any) => this.openAddEditModal(row),
    // },
    {
      icon: 'assets/images/view.svg',
      tooltip: 'View',
      show: (row: any) => true,
      callback: (row: any) => this.openPushNotificationDetailsAndNavigate(row),
    },
    {
      icon: 'assets/images/delete.svg',
      tooltip: 'Delete',
      show: (row: any) => true,
      callback: (row: any) => this.openConfirmDeleteModal(row.id, row.name),
    }
  ];

  filterFields = [
    { label: 'Title', name: 'title', type: 'text' },
    {
      label: 'Role', name: 'role', type: 'select',
      options: this.roles.map(role => ({
        label: role.name,
        value: role.id
      }))
    },
    {
      label: 'User', name: 'user', type: 'select',
      options: this.users.map(user => ({
        label: user.fullName,
        value: user.id
      }))
    },
    { label: 'Date', name: 'date', type: 'date' },
  ];

  filters = {
    title: '',
    role: '',
    user: '',
    date: '',
  };

  constructor(
    private modalService: NgbModal,
    private pushNotificationsService: PushNotificationsService,
    private wajbaUserService: WajbaUserService,
    private roleService: RoleService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadPushNotification();
    this.loadRoles();
    this.loadUsers();
  }

  // Load all notifications
  loadPushNotification(): void {
    const defaultInput: GetPushnotificationinput = {
      sorting: '',
      skipCount: (this.currentPage - 1) * 10,
      maxResultCount: 10,
      title: this.filters.title || '',
      roleId: Number(this.filters.role) || undefined,
      userId: Number(this.filters.user) || undefined,
      date: this.filters.date || undefined,
    };

    this.pushNotificationsService.getAllByGet(defaultInput).subscribe({
      next: (response) => {
        console.log(response);
        this.notifications = response.data.items;
        this.totalPages = Math.ceil(response.data.totalCount / 10);

        this.tableData = this.notifications.map(notification => ({
          title: notification.title,
          roleName: notification.roleName,
          userName: notification.userName,
          date: notification.date,
        }));
      },
      error: (err) => {
        console.error('Error loading notifications:', err);
      },
    });
  }

  loadUsers(): void {
    const defaultInput: GetUserListDto = {
      skipCount: undefined,
      maxResultCount: undefined,
    };

    this.wajbaUserService.getWajbaUserByInput(defaultInput).subscribe({
      next: (response) => {
        // console.log(response);
        this.users = response.items;
        this.updateFilterFields();
      },
      error: (err) => {
        console.error('Error loading users:', err);
      },
    });
  }

  loadRoles(): void {
    this.roleService.getall().subscribe({
      next: (response) => {
        this.roles = response.data.items;
        this.updateFilterFields();
      },
      error: (error) => {
        console.error('Error fetching roles:', error);
      }
    });
  }

  updateFilterFields(): void {
    this.filterFields = this.filterFields.map(field => {
      if (field.name === 'user') {
        return {
          ...field,
          options: this.users.map(user => ({
            label: user.fullName,
            value: user.id
          }))
        };
      }
      if (field.name === 'role') {
        return {
          ...field,
          options: this.roles.map(tax => ({
            label: tax.name,
            value: tax.id
          }))
        };
      }
      return field;
    });
  }

  openAddEditModal(notification?: UpdatePushNotificationDto): void {
    const modalRef = this.modalService.open(AddPushNotificationComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.isOpen = true;
    modalRef.componentInstance.notification = notification || null;

    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });

    modalRef.result
      .then((result) => {
        if (result === 'saved') {
          this.loadPushNotification();
        }
      })
      .catch((reason) => {
        console.log('Modal dismissed:', reason);
      });
  }

  openConfirmDeleteModal(notificationId: number, notificationName: string): void {
    const modalRef = this.modalService.open(ConfirmDeleteModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    // Pass data to the modal instance
    modalRef.componentInstance.id = notificationId;
    modalRef.componentInstance.name = notificationName;

    // Handle modal result
    modalRef.componentInstance.confirmDelete.subscribe((id) => {
      this.deleteNotification(id); // Call the delete method with the notification ID
    });

    modalRef.componentInstance.cancelDelete.subscribe(() => {
      modalRef.close(); // Close modal on cancel
    });
  }

  deleteNotification(id: number): void {
    this.pushNotificationsService.delete(id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter((notification) => notification.id !== id);
        this.modalService.dismissAll(); // Close all modals
      },
      error: (err) => {
        console.error('Error deleting notification:', err);
      },
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPushNotification();
  }

  openPushNotificationDetailsAndNavigate(notification: UpdatePushNotificationDto) {
    console.log(notification)
    this.router.navigate(['/push-notification', notification.id]);
  }

  toggleFilterVisibility(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  applyFilters(filters: any): void {
    this.filters = filters;
    this.currentPage = 1; // Reset to the first page
    this.loadPushNotification();
  }

  clearFilters(): void {
    this.filters = {
      title: '',
      role: '',
      user: '',
      date: '',
    };
    this.loadPushNotification();
  }
}
