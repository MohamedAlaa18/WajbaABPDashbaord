import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ItemAttributeService, ItemVariationService } from '@proxy/controllers';
import { UpdateItemAttributeDto } from '@proxy/dtos/item-attributes';
import { CreateItemVariationDto, UpdateItemVariationDto } from '@proxy/dtos/item-variation-contract';
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
  @Input() variation: any;
  variationForm: FormGroup;
  itemId!: number;
  attributes!: UpdateItemAttributeDto[];
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private variationService: ItemVariationService,
    private attributeService: ItemAttributeService,
    private activatedRoute: ActivatedRoute,
    private afterActionService: AfterActionService,
  ) {
    this.variationForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      attribute: ['', Validators.required],
      status: [1, Validators.required],
      caution: ['']
    });

    this.itemId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    // Check if variation is provided (Edit mode)
    this.fetchAttributes();

    if (this.variation) {
      this.isEditMode = true;

      // Patch the form with the variation values
      this.variationForm.patchValue({
        name: this.variation.name,
        price: this.variation.additionalPrice,
        attribute: this.variation.itemattributesId,
        status: this.variation.status === 1 ? 'Active' : 'Inactive',
        caution: this.variation.note || ''
      });
    }
  }

  fetchAttributes(): void {
    const defaultInput: PagedAndSortedResultRequestDto = {
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.attributeService.getList(defaultInput).subscribe(
      (response) => {
        this.attributes = response.data;
        console.log(response)
      },
      (error) => {
        console.error('Error fetching extras:', error);
      }
    );
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


      // const variationData = {
      //   name: this.variationForm.value.name,
      //   note: this.variationForm.value.caution,
      //   status: this.variationForm.value.status,
      //   additionalPrice: Number(this.variationForm.value.price),
      //   itemattributesId: this.variationForm.value.attribute,
      //   itemId: this.itemId
      // };

      if (this.isEditMode) {
        // this.variationService.updateVariationForItem(formValue as UpdateItemVariationDto)
        //   .subscribe({
        //     next: (response) => {
        //       console.log('Variation updated successfully', response);
        //       this.closeModal();
        //       this.afterActionService.reloadCurrentRoute();
        //     },
        //     error: (err) => console.error('Error updating variation:', err)
        //   });
      } else {
        this.variationService.create(formValue as CreateItemVariationDto)
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
