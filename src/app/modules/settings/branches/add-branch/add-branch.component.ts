import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BranchService } from '@proxy/controllers';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { IconsComponent } from "../../../../shared/icons/icons.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapModalComponent } from '../map-modal/map-modal.component';
import { CreateBranchDto, UpdateBranchDto } from '@proxy/dtos/branch-contract';

@Component({
  selector: 'app-add-branch',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent],
  templateUrl: './add-branch.component.html',
  styleUrl: './add-branch.component.scss'
})
export class AddBranchComponent {
  @Input() isOpen: boolean = false;
  @Input() branch: UpdateBranchDto | null = null;
  @Output() close = new EventEmitter<void>();

  branchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private afterActionService: AfterActionService,
    private branchService: BranchService,
    private modalService: NgbModal,
  ) {
    this.branchForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      phone: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      address: ['', Validators.required],
      status: [1],
      longitude: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.branch) {
      this.populateForm(this.branch);
    }
  }

  populateForm(branch: UpdateBranchDto) {
    this.branchForm.patchValue({
      id: branch.id,
      name: branch.name,
      email: branch.email,
      city: branch.city,
      state: branch.state,
      phone: branch.phone,
      zipCode: branch.zipCode,
      address: branch.address,
      status: branch.status,
      longitude: branch.longitude || '',
      latitude: branch.latitude || '',
    });
  }

  closeModal() {
    this.close.emit();
  }

  submitForm() {
    if (this.branchForm.valid) {
      // Declare the formValue outside the if-else block
      let formValue: CreateBranchDto | UpdateBranchDto;

      // Determine whether it's an update or create operation
      if (this.branchForm.value.id) {
        formValue = this.branchForm.value as UpdateBranchDto;
      } else {
        formValue = this.branchForm.value as CreateBranchDto;
      }

      console.log(formValue);

      if (this.branch) {
        // Update existing branch
        this.branchService.update(formValue as UpdateBranchDto)
          .subscribe(
            response => {
              // Handle successful response
              console.log('Branch updated successfully:', response);
            },
            error => {
              // Handle error response
              console.error('Error updating branch:', error);
            }
          );
      } else {
        // Create a new branch
        this.branchService.create(formValue as CreateBranchDto)
          .subscribe(
            response => {
              // Handle successful response
              console.log('Branch created successfully:', response);
            },
            error => {
              // Handle error response
              console.error('Error creating branch:', error);
            }
          );
      }
    } else {
      // Mark all form controls as touched to trigger validation messages
      this.branchForm.markAllAsTouched();
    }
  }

  openMapModal() {
    const modalRef = this.modalService.open(MapModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });

    modalRef.componentInstance.coordinatesSelected.subscribe(({ longitude, latitude }) => {
      this.setCoordinates(longitude, latitude);
      modalRef.close();
    });
  }

  // Method to receive coordinates from the map modal
  setCoordinates(longitude: number, latitude: number) {
    this.branchForm.patchValue({
      longitude: longitude,
      latitude: latitude
    });
  }
}
