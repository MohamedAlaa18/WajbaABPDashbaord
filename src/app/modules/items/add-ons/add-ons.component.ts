import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ItemAddonService } from '@proxy/controllers';
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
  @Input() addon: any;
  addonForm: FormGroup;
  isEditMode = false;
  addonDropdown: any[] = [];
  variationsAddonDropdown: any[] = [];
  selectedVariationPrice!: number;
  selectedAddonName: string = '';
  itemId!: number;

  constructor(
    private fb: FormBuilder,
    private addonsService: ItemAddonService,
    private activatedRoute: ActivatedRoute,
    private afterActionService: AfterActionService,
  ) {
    this.addonForm = this.fb.group({
      option: ['', Validators.required],
      variation: ['', Validators.required]
    });

    this.itemId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    if (this.addon) {

      this.isEditMode = true;
      this.addonForm.patchValue(this.addon);
    }

    this.fetchAddonDropdown();

    this.addonForm.get('option')?.valueChanges.subscribe((itemId: number) => {
      this.fetchVariationsAddonDropdown(itemId);
    });
  }

  fetchAddonDropdown(): void {
    // this.addonsService.getItemForAddonDropdowns().subscribe(
    //   (response) => {
    //     this.addonDropdown = response.data.itemsDropdown || [];
    //   },
    //   (error) => {
    //     console.error('Error fetching Addon Dropdown:', error);
    //   }
    // );
  }

  fetchVariationsAddonDropdown(itemId: number): void {
    // if (itemId) {
    //   this.addonsService.getVariationsAddonDropdowns(itemId).subscribe(
    //     (response) => {
    //       this.variationsAddonDropdown = response.data || [];
    //     },
    //     (error) => {
    //       console.error('Error fetching variations Addon Dropdown:', error);
    //     }
    //   );
    // }
  }

  onVariationSelectionChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;

    const selectedVariation = this.variationsAddonDropdown.find(variation => variation.variationId === Number(selectedValue));

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
      this.fetchVariationsAddonDropdown(itemId);
    }
  }

  saveAddon() {
    if (this.addonForm.valid) {
      const itemId = this.itemId;

      // Find the selected addon name from the dropdown
      const selectedAddon = this.addonDropdown.find(item => item.itemId === Number(itemId));
      if (selectedAddon) {
        this.selectedAddonName = selectedAddon.itemName;
      }

      console.log('Selected Variation Price:', this.selectedVariationPrice);

      const price = this.selectedVariationPrice;

      if (this.isEditMode) {
        const itemAddonId = this.addon.id;

        // this.addonsService.updateAddonForItem(itemAddonId, this.selectedAddonName, price, itemId)
        //   .subscribe(
        //     response => {
        //       console.log('Addon updated:', response);
        //       this.afterActionService.reloadCurrentRoute();
        //       this.closeModal();
        //     },
        //     error => {
        //       console.error('Error updating addon:', error);
        //     }
        //   );
      } else {
        // this.addonsService.create(this.selectedAddonName, price, itemId)
        //   .subscribe(
        //     response => {
        //       console.log('Addon created:', response);
        //       this.afterActionService.reloadCurrentRoute();
        //       this.closeModal();
        //     },
        //     error => {
        //       console.error('Error creating addon:', error);
        //     }
        //   );
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
