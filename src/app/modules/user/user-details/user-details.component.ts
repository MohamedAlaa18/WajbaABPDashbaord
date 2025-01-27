import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeleteModalComponent } from 'src/app/shared/confirm-delete-modal/confirm-delete-modal.component';
import { AddAddressComponent } from '../add-address/add-address.component';
import { UserAddressService, WajbaUserService } from '@proxy/controllers';
import { WajbaUserDto } from '@proxy/dtos/wajba-users-contract';
import { IconsComponent } from 'src/app/shared/icons/icons.component';
import { UpdateUserAddressDto } from '@proxy/dtos/user-address-contract';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';


@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, IconsComponent],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  userId: any;
  user!: WajbaUserDto;
  isModalOpen = false;
  selectedFile: File | null = null;

  columns = [
    { field: 'label', header: 'Label' },
    { field: 'address', header: 'Address' },
    { field: 'apartment', header: 'Apartment' },
  ];

  actions = [
    {
      icon: 'assets/images/edit.svg',
      tooltip: 'Edit',
      show: (row: any) => true,
      callback: (row: any) => this.openAddEditAddressModal(row),
    },
    {
      icon: 'assets/images/delete.svg',
      tooltip: 'Delete',
      show: (row: any) => true,
      callback: (row: any) => this.openConfirmDeleteModal(row.id, row.name),
    },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private wajbaUserService: WajbaUserService,
    private userAddressService: UserAddressService,
    private afterActionService: AfterActionService
  ) {
    this.userId = this.activatedRoute.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.wajbaUserService.getWajbaUserById(this.userId).subscribe(
      (response) => {
        this.user = response.data;
        console.log(response);

        if (this.user && this.user.type === 4) {
          this.loadAddress();
        }
      },
      (error) => {
        console.error('Error fetching customer data:', error);
      }
    );
  }

  loadAddress(): void {
    this.userAddressService.getAllByCustomer(this.userId).subscribe(
      (response) => {
        this.user = response.data;
        console.log(response);
      },
      (error) => {
        console.error('Error fetching customer data:', error);
      }
    );
  }

  openAddEditAddressModal(address?: UpdateUserAddressDto): void {
    const modalRef = this.modalService.open(AddAddressComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.isOpen = true;
    modalRef.componentInstance.address = address || null;
    modalRef.componentInstance.customerId = this.userId || null;

    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });

    modalRef.result
      .then((result) => {
        if (result === 'saved') {
          this.loadUser();
        }
      })
      .catch((reason) => {
        console.log('Modal dismissed:', reason);
      });
  }

  closeModal() {
    this.isModalOpen = false;
  }

  openConfirmDeleteModal(addressId: number, addressName: string): void {
    const modalRef = this.modalService.open(ConfirmDeleteModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    // Pass data to the modal instance
    modalRef.componentInstance.id = addressId;
    modalRef.componentInstance.name = addressName;

    // Handle modal result
    modalRef.componentInstance.confirmDelete.subscribe((id) => {
      this.deleteAddress(id); // Call the delete method with the address ID
    });

    modalRef.componentInstance.cancelDelete.subscribe(() => {
      modalRef.close(); // Close modal on cancel
    });
  }

  deleteAddress(id: number) {
    this.userAddressService.delete(id).subscribe(
      (response) => {
        console.log('Address deleted successfully:', response);
        this.afterActionService.reloadCurrentRoute();
      },
      (error) => {
        console.error('Error deleting address:', error);
      }
    );
  }

  uploadNewImage() {
    // if (this.selectedFile)
    //   this.employeeService.updateProfileImage(Number(this.userId), this.selectedFile).subscribe(
    //     (response) => {
    //       console.log('Image updated successfully:', response);
    //       this.afterActionService.reloadCurrentRoute();
    //     },
    //     (error) => {
    //       console.error('Error updating image:', error);
    //     }
    //   );
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadNewImage();

    } else {
      this.selectedFile = null;
    }
  }
}
