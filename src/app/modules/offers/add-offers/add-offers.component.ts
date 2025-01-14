import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateUpdateOfferDto } from '@proxy/offers-contract';
import { CategoryService, ItemService, OfferService } from '@proxy/controllers';
import { ItemDto } from '@proxy/dtos/items-dtos';
import { GetCategoryInput, UpdateCategory } from '@proxy/dtos/categories';
import { IconsComponent } from "../../../shared/icons/icons.component";
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-add-offers',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent, NgSelectModule],
  templateUrl: './add-offers.component.html',
  styleUrl: './add-offers.component.scss'
})
export class AddOffersComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() offer: CreateUpdateOfferDto | null = null;
  @Output() close = new EventEmitter<void>();

  offerForm: FormGroup;
  items!: ItemDto[];
  categories!: UpdateCategory[];

  selectedFile: File | null = null;

  itemsDropdownOpen = false;
  categoriesDropdownOpen = false;

  constructor(
    private fb: FormBuilder,
    private offerService: OfferService,
    private itemService: ItemService,
    private categoryService: CategoryService,
    private datePipe: DatePipe,
  ) {
    this.offerForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      discountType: ['', Validators.required],
      discount: ['', Validators.required],
      discountOn: ['items', Validators.required],
      selectedItems: this.fb.control([]),
      selectedCategories: this.fb.control([]),
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['', Validators.required],
      image: ['']
    });
  }

  ngOnInit(): void {
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

  populateForm(offer: CreateUpdateOfferDto) {
    const formattedStartDate = this.datePipe.transform(offer.startDate, 'yyyy-MM-dd');
    const formattedEndDate = this.datePipe.transform(offer.endDate, 'yyyy-MM-dd');

    this.offerForm.patchValue({
      name: offer.name,
      discountType: offer.discountType,
      discount: offer.discountPercentage,
      // discountOn: offer.items.length > 0 ? 'items' : 'categories',
      // selectedItems: offer.items,
      // selectedCategories: offer.categories,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      description: offer.description || '',
    });

    // this.offerForm.get('selectedItems')?.value = offer.items as ItemDto[];
    // this.offerForm.get('selectedItems')?.value = offer.categories;
  }


  loadCategories(): void {
    const defaultInput: GetCategoryInput = {
      name: '',
      branchId: 0,
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
    const storedBranch = JSON.parse(localStorage.getItem('selectedBranch') || '{}');
    this.itemService.getList(storedBranch.id).subscribe(
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
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  // Close modal
  closeModal() {
    this.close.emit();
  }

  submitForm(): void {
    if (this.offerForm.valid) {
      const formData = new FormData();
      const formValues = this.offerForm.value;

      // Format the dates to MM-DD-YYYY
      const formattedStartDate = this.datePipe.transform(formValues.startDate, 'MM-dd-yyyy');
      const formattedEndDate = this.datePipe.transform(formValues.endDate, 'MM-dd-yyyy');

      // Check if formatted dates are valid
      if (formattedStartDate === null || formattedEndDate === null) {
        console.error('Invalid date format for startDate or endDate.');
        return; // Exit the method if dates are invalid
      }

      // Append basic fields
      formData.append('name', formValues.name);
      // formData.append('status', this.offer ? formValues.status.toString() : '1');
      formData.append('status', '1');
      formData.append('startDate', formattedStartDate);
      formData.append('endDate', formattedEndDate);
      formData.append('discountType', formValues.discountType.toString());
      formData.append('discountPercentage', formValues.discount.toString());
      formData.append('description', formValues.description);

      // Append Image if selected
      if (this.selectedFile) {
        formData.append('imageUrl', this.selectedFile);
      }

      const discountOn = formValues.discountOn;

      // Handle discountOn conditionally and avoid appending empty arrays/fields
      if (discountOn === 'items' && this.offerForm.get('selectedItems')?.value.length > 0) {
        // Append ItemIds if items are selected
        this.offerForm.get('selectedItems')?.value.forEach((item: ItemDto) => {
          formData.append('itemIds[]', item.id.toString());
        });
      }

      if (discountOn === 'categories' && this.offerForm.get('selectedItems')?.value.length > 0) {
        // Append CategoryIds if categories are selected
        this.offerForm.get('selectedItems')?.value.forEach((category: UpdateCategory) => {
          formData.append('categoryIds[]', category.id.toString());
        });
      }

      // Ensure you are NOT sending empty values for itemIds[] or categoryIds[]
      // Remove the empty strings you had earlier for empty arrays

      // Debugging: log the form data before submission
      const formDataArray: [string, any][] = [];
      formData.forEach((value, key) => {
        formDataArray.push([key, value]);
      });
      console.log('FormData before sending:', formDataArray);

      // Check if we are updating or creating a new offer
      if (this.offer) {
        // this.offerService.update(this.offer.id, formData).subscribe(
        //   (response) => {
        //     console.log('Offer updated successfully:', response);
        //     this.closeModal();
        //     // this.afterActionService.reloadCurrentRoute();
        //   },
        //   (error) => {
        //     console.error('Error updating offer:', error);
        //   }
        // );
      } else {
        // this.offerService.create(formData).subscribe(
        //   (response) => {
        //     console.log('Offer created successfully:', response);
        //     this.closeModal();
        //     // this.afterActionService.reloadCurrentRoute();
        //   },
        //   (error) => {
        //     console.error('Error creating offer:', error);
        //   }
        // );
      }
    } else {
      console.log('Form is invalid:', this.offerForm);
      this.offerForm.markAllAsTouched();
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
