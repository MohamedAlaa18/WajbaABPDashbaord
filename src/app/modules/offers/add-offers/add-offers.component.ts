import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService, ItemService, OfferService } from '@proxy/controllers';
import { ItemDto } from '@proxy/dtos/items-dtos';
import { GetCategoryInput, UpdateCategory } from '@proxy/dtos/categories';
import { IconsComponent } from "../../../shared/icons/icons.component";
import { NgSelectModule } from '@ng-select/ng-select';
import { CreateUpdateOfferDto, OfferDto, UpdateOfferdto } from '@proxy/dtos/offers-contract';
import { Base64Service } from 'src/app/services/base64/base64.service';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { Base64ImageModel } from '@proxy/dtos/themes-contract';
import { BranchDto } from '@proxy/dtos/branch-contract';

@Component({
  selector: 'app-add-offers',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent, NgSelectModule],
  templateUrl: './add-offers.component.html',
  styleUrl: './add-offers.component.scss'
})
export class AddOffersComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() offer: OfferDto | null = null;
  @Output() close = new EventEmitter<void>();

  offerForm: FormGroup;
  items!: ItemDto[];
  categories!: UpdateCategory[];
  selectedFile: File | null = null;
  itemsDropdownOpen = false;
  categoriesDropdownOpen = false;
  isSubmitting: boolean = false;
  selectedBranch: BranchDto;

  constructor(
    private fb: FormBuilder,
    private offerService: OfferService,
    private itemService: ItemService,
    private categoryService: CategoryService,
    private datePipe: DatePipe,
    private base64Service: Base64Service,
    private afterActionService: AfterActionService,
  ) {
    this.offerForm = this.fb.group({
      id: [this.offer?.id],
      name: ['', Validators.required],
      discountType: ['', Validators.required],
      discountPercentage: ['', Validators.required],
      discountOn: ['items', Validators.required],
      selectedItems: this.fb.control([]),
      selectedCategories: this.fb.control([]),
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.selectedBranch = JSON.parse(localStorage.getItem('selectedBranch'));

    if (this.offer) {
      this.populateForm(this.offer);
    }

    this.loadCategories();
    this.loadItems();

    this.updateSelectedItemsAndCategoriesValidators();

    this.offerForm.get('discountOn')?.valueChanges.subscribe(() => {
      this.updateSelectedItemsAndCategoriesValidators();
    });
  }

  populateForm(offer: OfferDto): void {
    const formattedStartDate = this.datePipe.transform(offer.startDate, 'yyyy-MM-dd');
    const formattedEndDate = this.datePipe.transform(offer.endDate, 'yyyy-MM-dd');

    this.offerForm.patchValue({
      id: offer.id,
      name: offer.name,
      discountType: offer.discountType,
      discountPercentage: offer.discountPercentage,
      discountOn: offer.itemDtos && offer.itemDtos.length > 0 ? 'items' : 'categories',
      selectedItems: offer.itemDtos && offer.itemDtos.length > 0 ? offer.itemDtos.map(item => item.id) : [], // Populate itemDtos
      selectedCategories: offer.categoryDtos && offer.categoryDtos.length > 0 ? offer.categoryDtos.map(category => category.id) : [], // Populate categoryIds
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      description: offer.description || '',
    });
  }

  loadCategories(): void {
    const defaultInput: GetCategoryInput = {
      name: '',
      branchId: this.selectedBranch.id,
      maxResultCount: 10
    };

    this.categoryService.getList(defaultInput).subscribe({
      next: (response) => {
        console.log(response)
        this.categories = response.data.items;
      },
      error: (err) => {
        console.error('Error loading Item Categories:', err);
      },
    });
  }

  loadItems(): void {
    const defaultInput: GetCategoryInput = {
      name: '',
      branchId: this.selectedBranch.id,
      maxResultCount: 10
    };

    this.itemService.getList(defaultInput).subscribe(
      (response: any) => {
        this.items = response.data.items;
      },
      (error) => {
        console.error('Error loading items:', error);
      }
    );
  }

  // Handle file selection
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.offerForm.patchValue({ image: file });
      this.selectedFile = input.files[0];
    }
  }

  // Close modal
  closeModal() {
    this.close.emit();
  }

  submitForm(): void {
    if (this.offerForm.invalid) {
      console.log('Form is invalid');
      this.offerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true; // Prevent multiple submissions

    // Prepare base64 model if a file is selected
    const base64Model: Base64ImageModel | null = this.selectedFile
      ? {
        id: this.offer?.id || 0,
        fileName: this.selectedFile.name,
        base64Content: '' // Placeholder, updated after conversion
      }
      : null;

    let formValue: CreateUpdateOfferDto | UpdateOfferdto = {
      name: this.offerForm.value.name,
      discountType: this.offerForm.value.discountType,
      discountPercentage: this.offerForm.value.discountPercentage,
      description: this.offerForm.value.description,
      startDate: this.datePipe.transform(this.offerForm.value.startDate, 'yyyy-MM-dd') || '',
      endDate: this.datePipe.transform(this.offerForm.value.endDate, 'yyyy-MM-dd') || '',
      model: base64Model as Base64ImageModel, // Ensure type compatibility
      itemIds: this.offerForm.value.selectedItems.map((id: string | number) => Number(id)), // Ensure number[]
      categoryIds: this.offerForm.value.selectedCategories.map((id: string | number) => Number(id)), // Ensure number[]
      status: 1, // Hardcoded status
      branchId: this.selectedBranch.id, // Hardcoded branchId
    };

    console.log('Form value:', formValue); // Debugging

    const processOffer = (base64Content: string | null) => {
      if (formValue.model) {
        formValue.model.base64Content = base64Content || '';
      }

      const request$ = this.offer
        ? this.offerService.update({ ...(formValue as UpdateOfferdto), id: this.offer.id })
        : this.offerService.create(formValue as CreateUpdateOfferDto);

      request$.subscribe({
        next: (response) => {
          console.log(`Offer ${this.offer ? 'updated' : 'created'} successfully:`, response);
          this.closeModal();
          this.afterActionService.reloadCurrentRoute();
        },
        error: (error) => {
          console.error(`Error ${this.offer ? 'updating' : 'creating'} offer:`, error);
          // this.returnedErrorMessage = error.error?.message || 'An error occurred';
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    };

    // Handle base64 conversion if a file is selected
    if (this.selectedFile) {
      this.base64Service.convertToBase64(this.selectedFile)
        .then(processOffer)
        .catch((error: any) => {
          console.error('Error converting image to Base64:', error);
          this.isSubmitting = false;
        });
    } else {
      processOffer(null);
    }
  }

  toggleItemsDropdown() {
    this.itemsDropdownOpen = !this.itemsDropdownOpen;
  }

  toggleCategoriesDropdown() {
    this.categoriesDropdownOpen = !this.categoriesDropdownOpen;
  }

  toggleItemSelection(item: ItemDto) {
    const index = this.offerForm.get('selectedItems')?.value.findIndex((selected) => selected.id === item.id);
    if (index === -1) {
      this.offerForm.get('selectedItems')?.value.push(item);
    } else {
      this.offerForm.get('selectedItems')?.value.splice(index, 1);
    }
    this.offerForm.patchValue({ selectedItems: this.offerForm.get('selectedItems')?.value });
  }

  toggleCategorySelection(category: UpdateCategory) {
    const index = this.offerForm.get('selectedItems')?.value.findIndex((selected) => selected.id === category.id);
    if (index === -1) {
      this.offerForm.get('selectedItems')?.value.push(category);
    } else {
      this.offerForm.get('selectedItems')?.value.splice(index, 1);
    }
    this.offerForm.patchValue({ selectedCategories: this.offerForm.get('selectedItems')?.value });
  }

  updateSelectedItemsAndCategoriesValidators() {
    const discountOn = this.offerForm.get('discountOn')?.value;

    if (discountOn === 'items') {
      this.offerForm.get('selectedItems')?.setValidators(Validators.required);
      this.offerForm.get('selectedCategories')?.clearValidators();
    } else if (discountOn === 'categories') {
      this.offerForm.get('selectedCategories')?.setValidators(Validators.required);
      this.offerForm.get('selectedItems')?.clearValidators();
    }

    this.offerForm.get('selectedItems')?.updateValueAndValidity();
    this.offerForm.get('selectedCategories')?.updateValueAndValidity();
  }

  isItemSelected(item: ItemDto): boolean {
    return this.offerForm.get('selectedItems')?.value.includes(item) ||
      this.offerForm.get('selectedItems')?.value.some(selectedItem => selectedItem.id === item.id);;
  }

  isCategorySelected(category: any): boolean {
    return this.offerForm.get('selectedItems')?.value.includes(category) ||
      this.offerForm.get('selectedItems')?.value.some(selectedCategory => selectedCategory.id === category.id);
  }
}
