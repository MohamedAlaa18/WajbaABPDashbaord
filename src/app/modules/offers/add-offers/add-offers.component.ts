import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService, ItemService, OfferService } from '@proxy/controllers';
import { ItemDto } from '@proxy/dtos/items-dtos';
import { GetCategoryInput, UpdateCategory } from '@proxy/dtos/categories';
import { IconsComponent } from "../../../shared/icons/icons.component";
import { NgSelectModule } from '@ng-select/ng-select';
import { CreateUpdateOfferDto, UpdateOfferdto } from '@proxy/dtos/offers-contract';
import { Base64Service } from 'src/app/services/base64/base64.service';

@Component({
  selector: 'app-add-offers',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent, NgSelectModule],
  templateUrl: './add-offers.component.html',
  styleUrl: './add-offers.component.scss'
})
export class AddOffersComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() offer: UpdateOfferdto | null = null;
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
    private base64Service: Base64Service,
  ) {
    this.offerForm = this.fb.group({
      id: [this.offer?.id],
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

  populateForm(offer: UpdateOfferdto) {
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
      const formValues = this.offerForm.value;

      // Format the dates to `MM-dd-yyyy`
      const formattedStartDate = this.datePipe.transform(formValues.startDate, 'MM-dd-yyyy');
      const formattedEndDate = this.datePipe.transform(formValues.endDate, 'MM-dd-yyyy');

      if (!formattedStartDate || !formattedEndDate) {
        console.error('Invalid date format for startDate or endDate.');
        return;
      }

      // Ensure endDate is not earlier than startDate
      if (new Date(formattedEndDate) < new Date(formattedStartDate)) {
        console.error('End date cannot be earlier than start date.');
        return;
      }

      // Prepare base64Model and handle when no file is selected
      const base64Model = this.selectedFile
        ? {
            id: this.offer?.id || 0,
            fileName: this.selectedFile.name,
            base64Content: '' // updated field name
          }
        : null;

      const processOffer = (base64Content: string | null) => {
        if (base64Model) base64Model.base64Content = base64Content || ''; // update field name

        // Prepare the DTO
        const offerDto = {
          name: formValues.name,
          discountType: formValues.discountType,
          discountPercentage: formValues.discount,
          description: formValues.description,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          model: base64Model,
          itemIds: formValues.selectedItems,
          categoryIds: formValues.selectedCategories,
          status: 1, // Hardcoded status
          branchId: 1, // Hardcoded branchId
        };

        if (this.offer) {
          // Update logic
          const updateOfferDto: UpdateOfferdto = {
            ...offerDto,
            id: this.offer.id
          };
          this.offerService.update(updateOfferDto).subscribe({
            next: (response) => {
              console.log('Offer updated successfully:', response);
              this.closeModal();
            },
            error: (error) => {
              console.error('Error updating offer:', error);
            },
          });
        } else {
          // Create logic
          // console.log('Creating offer:', offerDto);
          this.offerService.create(offerDto as CreateUpdateOfferDto).subscribe({
            next: (response) => {
              console.log('Offer created successfully:', response);
              this.closeModal();
            },
            error: (error) => {
              console.error('Error creating offer:', error);
            },
          });
        }
      };

      // Handle base64 image conversion if a file is selected
      if (this.selectedFile) {
        this.base64Service.convertToBase64(this.selectedFile)
          .then(processOffer)
          .catch((error: any) => {
            console.error('Error converting image to Base64:', error);
          });
      } else {
        processOffer(null); // No image file was selected
      }
    } else {
      console.error('Form is invalid:', this.offerForm);
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
