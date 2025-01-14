import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  @Input() extra: any;
  extraForm: FormGroup;
  isEditMode = false;
  itemId!: number;

  constructor(
    private fb: FormBuilder,
    private itemExtraService: ItemExtraService,
    private activatedRoute: ActivatedRoute,
    private afterActionService: AfterActionService,
  ) {
    this.extraForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      status: [1, Validators.required],
    });

    this.itemId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    if (this.extra) {
      this.isEditMode = true;
      this.extraForm.patchValue(this.extra);
    }

    this.extraForm.patchValue({
      name: this.extra.name,
      price: this.extra.additionalPrice,
      status: this.extra.status === 1 ? 'Active' : 'Inactive',
    });
  }

  saveExtra() {
    if (this.extraForm.valid) {

      let formValue: CreateItemExtraDto | UpdateItemExtraDto;

      // Determine whether it's an update or create operation
      if (this.extraForm.value.id) {
        formValue = this.extraForm.value as UpdateItemExtraDto;
      } else {
        formValue = this.extraForm.value as CreateItemExtraDto;
      }

      // const ExtraData = {
      //   name: this.extraForm.value.name,
      //   status: this.extraForm.value.status === 'Active' ? 1 : 0,
      //   additionalPrice: Number(this.extraForm.value.price),
      //   itemId: this.itemId
      // };

      if (this.isEditMode) {
        // Update existing extra
        // this.itemExtraService.updateExtraForItem(formValue as UpdateItemExtraDto)
        //   .subscribe(
        //     response => {
        //       console.log('Extra updated:', response);
        //       this.closeModal();
        //       this.afterActionService.reloadCurrentRoute();
        //     },
        //     error => {
        //       console.error('Error updating extra:', error);
        //     }
        //   );
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
