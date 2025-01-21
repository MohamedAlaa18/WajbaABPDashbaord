import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IconsComponent } from 'src/app/shared/icons/icons.component';
import { ItemExtraService } from '@proxy/controllers';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { CreateItemExtraDto, UpdateItemExtraDto } from '@proxy/dtos/item-extra-contract';

@Component({
  selector: 'app-add-extra',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent],
  templateUrl: './add-extra.component.html',
  styleUrl: './add-extra.component.scss'
})
export class AddExtraComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() extra: UpdateItemExtraDto;
  @Input() itemId: number;
  extraForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private itemExtraService: ItemExtraService,
    private afterActionService: AfterActionService,
  ) {
    this.extraForm = this.fb.group({
      extraId: [this.extra?.extraId],
      itemId: [this.itemId],
      name: ['', Validators.required],
      additionalPrice: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      status: [1, Validators.required],
    });
  }

  ngOnInit() {
    this.extraForm.patchValue({ itemId: this.itemId }); // Ensure itemId is always set

    if (this.extra) {
      this.isEditMode = true;
      this.extraForm.patchValue(this.extra);
      this.populateForm(this.extra);
    }
  }

  populateForm(extra: any) {
    console.log('Populating form:', extra);
    this.extraForm.patchValue({
      extraId: extra.id,
      itemId: this.itemId,
      name: extra.name,
      additionalPrice: extra.additionalPrice,
      status: extra.status,
    });
  }

  saveExtra() {
    if (this.extraForm.valid) {

      let formValue: CreateItemExtraDto | UpdateItemExtraDto;

      // Determine whether it's an update or create operation
      if (this.extraForm.value.extraId) {
        formValue = this.extraForm.value as UpdateItemExtraDto;
      } else {
        formValue = this.extraForm.value as CreateItemExtraDto;
      }

      console.log('Form value:', formValue);

      if (this.isEditMode) {
        // Update existing extra
        this.itemExtraService.updateExtraForItem(formValue as UpdateItemExtraDto)
          .subscribe(
            response => {
              console.log('Extra updated:', response);
              this.closeModal();
              this.afterActionService.reloadCurrentRoute();
            },
            error => {
              console.error('Error updating extra:', error);
            }
          );
      } else {
        // Create a new extra
        this.itemExtraService.create(formValue as CreateItemExtraDto)
          .subscribe(
            response => {
              console.log('Extra created:', response);
              this.closeModal();
              this.afterActionService.reloadCurrentRoute();
            },
            error => {
              console.error('Error creating extra:', error);
            }
          );
      }
    } else {
      console.log('Form is invalid:', this.extraForm);
      this.extraForm.markAllAsTouched();
    }
  }

  closeModal() {
    this.close.emit();
  }
}
