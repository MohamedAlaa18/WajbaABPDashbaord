import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ItemAttributeService, ItemVariationService } from '@proxy/controllers';
import { UpdateItemAttributeDto } from '@proxy/dtos/item-attributes';
import { CreateItemVariationDto, ItemVariationDto, UpdateItemVariationDto } from '@proxy/dtos/item-variation-contract';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { IconsComponent } from 'src/app/shared/icons/icons.component';


@Component({
  selector: 'app-add-variation',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent],
  templateUrl: './add-variation.component.html',
  styleUrl: './add-variation.component.scss'
})
export class AddVariationComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() variation: ItemVariationDto;
  @Input() itemId: number;
  variationForm: FormGroup;
  attributes!: UpdateItemAttributeDto[];
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private itemVariationService: ItemVariationService,
    private itemAttributeService: ItemAttributeService,
    private afterActionService: AfterActionService,
  ) {
    this.variationForm = this.fb.group({
      variationId: [this.variation?.id],
      itemId: [this.itemId],
      name: ['', Validators.required],
      additionalPrice: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      itemAttributesId: ['', Validators.required],
      status: [1, Validators.required],
      note: ['']
    });
  }

  ngOnInit() {
    // Check if variation is provided (Edit mode)
    this.loadItemAttributes();

    this.variationForm.patchValue({ itemId: this.itemId }); // Ensure itemId is always set

    if (this.variation) {
      this.isEditMode = true;

      // Patch the form with the variation values
      this.variationForm.patchValue({
        variationId: this.variation.id,
        name: this.variation.name,
        additionalPrice: this.variation.additionalPrice,
        itemAttributesId: this.variation.itemAttributesId,
        status: this.variation.status,
        note: this.variation.note || ''
      });
    }
  }

  loadItemAttributes(): void {
    const defaultInput: PagedAndSortedResultRequestDto = {
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.itemAttributeService.getList(defaultInput).subscribe({
      next: (response) => {
        console.log(response)
        this.attributes = response.data.items;
      },
      error: (err) => {
        console.error('Error loading item attributes:', err);
      },
    });
  }

  saveVariation() {
    if (this.variationForm.valid) {
      let formValue: CreateItemVariationDto | UpdateItemVariationDto;

      // Determine whether it's an update or create operation
      if (this.variationForm.value.id) {
        formValue = this.variationForm.value as UpdateItemVariationDto;
      } else {
        formValue = this.variationForm.value as CreateItemVariationDto;
      }

      console.log('Form value:', formValue);

      if (this.isEditMode) {
        this.itemVariationService.updateVariationForItem(formValue as UpdateItemVariationDto)
          .subscribe({
            next: (response) => {
              console.log('Variation updated successfully', response);
              this.closeModal();
              this.afterActionService.reloadCurrentRoute();
            },
            error: (err) => console.error('Error updating variation:', err)
          });
      } else {
        this.itemVariationService.create(formValue as CreateItemVariationDto)
          .subscribe({
            next: (response) => {
              console.log('Variation created successfully', response);
              this.closeModal();
              this.afterActionService.reloadCurrentRoute();
            },
            error: (err) => console.error('Error creating variation:', err)
          });
      }
    } else {
      console.log('Form is invalid:', this.variationForm);
      this.variationForm.markAllAsTouched();
    }
  }

  closeModal() {
    this.close.emit();
  }
}
