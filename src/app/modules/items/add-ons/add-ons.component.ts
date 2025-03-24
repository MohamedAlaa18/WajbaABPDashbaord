import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ItemAddonService, ItemService, ItemVariationService } from '@proxy/controllers';
import { ItemAddonDto } from '@proxy/dtos/item-addon-contract';
import { UpdateItemVariationDto } from '@proxy/dtos/item-variation-contract';
import { GetItemInput, UpdateItemDTO } from '@proxy/dtos/items-dtos';
import { Observable } from 'rxjs';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { IconsComponent } from 'src/app/shared/icons/icons.component';

@Component({
  selector: 'app-add-ons',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent, NgSelectModule],
  templateUrl: './add-ons.component.html',
  styleUrl: './add-ons.component.scss'
})
export class AddOnsComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() addon: ItemAddonDto;
  @Input() itemId: number;

  addonForm: FormGroup;
  isEditMode = false;
  items: UpdateItemDTO[] = [];
  variationsAddonDropdown: UpdateItemVariationDto[] = [];
  selectedVariationPrice!: number;
  selectedAddonName: string = '';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private itemAddonService: ItemAddonService,
    private itemVariationService: ItemVariationService,
    private itemService: ItemService,
    private afterActionService: AfterActionService,
  ) {
    this.addonForm = this.fb.group({
      itemId: [this.itemId],
      addonId: [this.addon?.id],
      option: ['', Validators.required],
      variation: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.addonForm.patchValue({ itemId: this.itemId }); // Ensure itemId is always set

    if (this.addon) {
      this.isEditMode = true;
      this.addonForm.patchValue({
        addonId: this.addon.id,
        option: this.addon.name,
        variation: this.addon.additionalPrice, // Adjust based on how you map variations
      });
    }

    this.loadItems();

    this.addonForm.get('option')?.valueChanges.subscribe((itemId: number) => {
      this.loadVariationsAddonDropdown(itemId);
    });
  }

  loadItems(): void {
    const selectedBranch = JSON.parse(localStorage.getItem('selectedBranch'));

    const defaultInput: GetItemInput = {
      sorting: '',
      // skipCount: 0,
      maxResultCount: undefined,
      branchId: selectedBranch.id,
    };

    this.itemService.getList(defaultInput).subscribe(
      (response) => {
        this.items = response.data.items || [];
      },
      (error) => {
        console.error('Error fetching Addon Dropdown:', error);
      }
    );
  }

  loadVariationsAddonDropdown(itemId: number): void {
    if (itemId) {
      this.itemVariationService.getVariationsByItemId(itemId).subscribe(
        (response) => {
          console.log('Response:', response);
          this.variationsAddonDropdown = response.data || [];
        },
        (error) => {
          console.error('Error fetching variations Addon Dropdown:', error);
        }
      );
    }
  }

  onVariationSelectionChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;

    const selectedVariation = this.variationsAddonDropdown.find(variation => variation.itemAttributesId === Number(selectedValue));

    if (selectedVariation) {
      this.selectedVariationPrice = selectedVariation.additionalPrice;
    } else {
      this.selectedVariationPrice = 0;
    }
  }

  onAddonSelectionChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue) {
      const itemId = Number(selectedValue);
      this.loadVariationsAddonDropdown(itemId);
    }
  }

  saveAddon() {
    this.handleFormSubmission(this.addonForm, this.itemAddonService, this.isEditMode, 'Addon');
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
      ? service.updateAddonForItem(formValue)
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
