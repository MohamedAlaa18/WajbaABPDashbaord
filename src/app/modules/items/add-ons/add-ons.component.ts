import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ItemAddonService, ItemService, ItemVariationService } from '@proxy/controllers';
import { CreateItemAddonDto, ItemAddonDto, UpdateItemAddonDto } from '@proxy/dtos/item-addon-contract';
import { UpdateItemVariationDto } from '@proxy/dtos/item-variation-contract';
import { UpdateItemDTO } from '@proxy/dtos/items-dtos';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { IconsComponent } from 'src/app/shared/icons/icons.component';

@Component({
  selector: 'app-add-ons',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent],
  templateUrl: './add-ons.component.html',
  styleUrl: './add-ons.component.scss'
})
export class AddOnsComponent {
  @Output() close = new EventEmitter<void>();
  @Input() addon: ItemAddonDto;
  @Input() itemId: number;

  addonForm: FormGroup;
  isEditMode = false;
  items: UpdateItemDTO[] = [];
  variationsAddonDropdown: UpdateItemVariationDto[] = [];
  selectedVariationPrice!: number;
  selectedAddonName: string = '';

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
    const defaultInput: PagedAndSortedResultRequestDto = {
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
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
      this.itemVariationService.getListByItemAttributeId(itemId).subscribe(
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
    if (this.addonForm.valid) {

      let formValue: CreateItemAddonDto | UpdateItemAddonDto;

      // Determine whether it's an update or create operation
      if (this.addonForm.value.addonId) {
        formValue = this.addonForm.value as UpdateItemAddonDto;
      } else {
        formValue = this.addonForm.value as CreateItemAddonDto;
      }

      console.log('Form value:', formValue);

      if (this.isEditMode) {
        // Update existing addon
        this.itemAddonService.updateAddonForItem(formValue as UpdateItemAddonDto)
          .subscribe(
            response => {
              console.log('addon updated:', response);
              this.closeModal();
              this.afterActionService.reloadCurrentRoute();
            },
            error => {
              console.error('Error updating addon:', error);
            }
          );
      } else {
        // Create a new addon
        this.itemAddonService.create(formValue as CreateItemAddonDto)
          .subscribe(
            response => {
              console.log('addon created:', response);
              this.closeModal();
              this.afterActionService.reloadCurrentRoute();
            },
            error => {
              console.error('Error creating addon:', error);
            }
          );
      }
    } else {
      console.log('Form is invalid:', this.addonForm);
      this.addonForm.markAllAsTouched();
    }
  }

  closeModal() {
    this.close.emit();
  }
}
