import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ItemService } from '@proxy/controllers';
import { CreateUpdateCouponDto, UpdateCoupondto } from '@proxy/dtos/coupon-contract';
import { AddPointsToItemDto, GetItemInput, ItemDto } from '@proxy/dtos/items-dtos';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { IconsComponent } from 'src/app/shared/icons/icons.component';

@Component({
  selector: 'app-add-points',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent, NgSelectModule],
  templateUrl: './add-points.component.html',
  styleUrl: './add-points.component.scss'
})
export class AddPointsComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() voucher: UpdateCoupondto | null = null;
  @Output() close = new EventEmitter<void>();

  items: ItemDto[] = [];
  pointsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private afterActionService: AfterActionService,
  ) {
    this.pointsForm = this.fb.group({
      id: [this.voucher?.id],
      itemId: ['', Validators.required],
      points: ['', Validators.required],
      status: [1, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadItems();

    if (this.voucher) {
      this.populateForm(this.voucher);
    }
  }

  populateForm(voucher: UpdateCoupondto) {
    this.pointsForm.patchValue({
      id: voucher.id,
      name: voucher.name,
      code: voucher.code,
      discount: voucher.discount,
    });
  }

  loadItems(): void {
    const input: GetItemInput = {
      sorting: '',
      skipCount: 0,
      maxResultCount: undefined,
    };

    this.itemService.getList(input).subscribe({
      next: (response) => {
        console.log(response);
        this.items = response.data.items;
      },
      error: (err) => {
        console.error('Error loading items:', err);
      },
    });
  }

  closeModal() {
    this.close.emit();
  }

  submitForm(): void {
    if (this.pointsForm.valid) {
      let formValue: AddPointsToItemDto;

      // Determine whether it's an update or create operation
      if (this.pointsForm.value.id) {
        // formValue = this.pointsForm.value as UpdateCoupondto;
      } else {
        formValue = this.pointsForm.value as AddPointsToItemDto;
      }

      if (this.voucher) {
        // Update existing voucher
        // this.itemService.update(formValue as UpdateCoupondto).subscribe(
        //   response => {
        //     console.log(response);
        //     this.closeModal();
        //     this.afterActionService.reloadCurrentRoute();
        //   },
        //   error => {
        //     console.error(error);
        //   }
        // );
      } else {
        // Create a new voucher
        this.itemService.addPointsToItemByInput(formValue as AddPointsToItemDto).subscribe(
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
      this.pointsForm.markAllAsTouched();
    }
  }
}
