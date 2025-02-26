import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  isSubmitting: boolean = false; // Prevent multiple submissions

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
    if (this.branchForm.invalid) {
      this.branchForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.branchForm.value as (CreateBranchDto | UpdateBranchDto);

    const request$ = this.branch
      ? this.branchService.update(formValue as UpdateBranchDto)
      : this.branchService.create(formValue as CreateBranchDto);

    request$.subscribe({
      next: (response) => {
        console.log(`${this.branch ? 'Branch updated' : 'Branch created'} successfully:`, response);
        this.afterActionService.reloadCurrentRoute();
        this.closeModal();
      },
      error: (error) => {
        console.error(`Error ${this.branch ? 'updating' : 'creating'} branch:`, error);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
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
