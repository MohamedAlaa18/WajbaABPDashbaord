import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ItemAttributeService, ItemVariationService } from '@proxy/controllers';
import { UpdateItemAttributeDto } from '@proxy/dtos/item-attributes';
import { CreateItemVariationDto, ItemVariationDto, UpdateItemVariationDto } from '@proxy/dtos/item-variation-contract';
import { Observable } from 'rxjs';
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
  isSubmitting: boolean = false;

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
    this.handleFormSubmission(this.variationForm, this.itemVariationService, this.isEditMode, 'Variation');
  }

  private handleFormSubmission(form: FormGroup, service: any, isEditMode: boolean, entityName: string) {
    if (form.invalid) {
      console.log(`Form is invalid:`, form);
      form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = form.value;

    const request$ = isEditMode
      ? service.updateVariationForItem(formValue)
      : service.create(formValue);

    this.handleSubmission(request$, entityName);
  }

  private handleSubmission(request$: Observable<any>, entityName: string) {
    request$.subscribe({
      next: (response) => {
        console.log(`${entityName} ${this.isEditMode ? 'updated' : 'created'} successfully`, response);
        this.closeModal();
        this.afterActionService.reloadCurrentRoute();
      },
      error: (error) => {
        console.error(`Error ${this.isEditMode ? 'updating' : 'creating'} ${entityName}:`, error);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  closeModal() {
    this.close.emit();
  }
}
