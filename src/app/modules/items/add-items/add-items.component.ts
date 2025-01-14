import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BranchService, CategoryService, ItemService, ItemTaxService } from '@proxy/controllers';
import { CreateBranchDto, GetBranchInput, UpdateBranchDto } from '@proxy/dtos/branch-contract';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { IconsComponent } from "../../../shared/icons/icons.component";
import { CreateItemDto, } from '@proxy/dtos/items-dtos';
import { CreateUpdateCategoryDto } from '@proxy/dtos/categories';
import { UpdateItemTaxDto } from '@proxy/dtos/item-tax-contract';

@Component({
  selector: 'app-add-items',
  standalone: true,
  imports: [NgSelectModule, ReactiveFormsModule, CommonModule, IconsComponent],
  templateUrl: './add-items.component.html',
  styleUrl: './add-items.component.scss'
})
export class AddItemsComponent {
  @Input() isOpen: boolean = false;
  @Input() item: any | null = null;
  @Output() close = new EventEmitter<void>();
  selectedBranches: number[] = []; // Array to hold selected branch IDs

  itemForm: FormGroup;
  categories: CreateUpdateCategoryDto[] = [];
  branchesList: CreateBranchDto[] = [];
  taxes: UpdateItemTaxDto[] = [];

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private branchService: BranchService,
    private categoryService: CategoryService,
    private itemTaxService: ItemTaxService,
  ) {
    this.itemForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      tax: [''],
      itemType: ['Veg', Validators.required],
      status: [1, Validators.required],
      branches: this.fb.control([], Validators.required),
      isFeatured: [1, Validators.required],
      image: [''],
      description: ['', Validators.required],
      note: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadBranches();
    this.loadCategory();
    this.loadTaxes();

    if (this.item) {
      this.populateForm(this.item);
    }
  }

  populateForm(item: any) {
    this.itemForm.patchValue({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.categoryId,
      tax: item.taxValue,
      itemType: item.itemType,
      status: item.status,
      isFeatured: item.isFeatured,
      image: item.imageUrl,
      description: item.description,
      note: item.note,
      // branches: item.branchIds || [], // Populate selected branches (multiple selections)
    });
  }

  loadBranches(): void {
    const defaultInput: GetBranchInput = {
      filter: '',
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.branchService.getList(defaultInput).subscribe({
      next: (response) => {
        this.branchesList = response.data.items;
      },
      error: (error) => {
        console.error('Error fetching branches:', error);
      }
    });
  }

  loadCategory(): void {
    const defaultInput: GetBranchInput = {
      filter: '',
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.categoryService.getList(defaultInput).subscribe({
      next: (response) => {
        this.categories = response.data.items;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  loadTaxes(): void {
    const defaultInput: GetBranchInput = {
      filter: '',
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.itemTaxService.getList(defaultInput).subscribe({
      next: (response) => {
        // this.taxes = response.data.items;
      },
      error: (error) => {
        console.error('Error fetching taxes:', error);
      }
    });
  }
  removeBranch(branchId: number): void {
    const branches = this.itemForm.get('branches')?.value;
    const index = branches.indexOf(branchId);
    if (index >= 0) {
      branches.splice(index, 1);
      this.itemForm.get('branches')?.setValue([...branches]);
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.itemForm.patchValue({ image: file });
    }
  }

  closeModal() {
    this.close.emit();
  }

  submitForm() {
    if (this.itemForm.valid) {
      let formValue: CreateItemDto | any;

      // Determine whether it's an update or create operation
      if (this.itemForm.value.id) {
        formValue = this.itemForm.value as any;
      } else {
        formValue = this.itemForm.value as CreateItemDto;
      }

      if (this.item) {
        // Update existing item
        this.itemService.update(this.item.id, formValue as CreateItemDto)
          .subscribe(
            response => {
              // Handle successful response
            },
            error => {
              // Handle error response
            }
          );
      } else {
        // Create a new item
        this.itemService.create(formValue as CreateItemDto)
          .subscribe(
            response => {
              // Handle successful response
            },
            error => {
              // Handle error response
            }
          );
      }
    } else {
      // Mark all form controls as touched to trigger validation messages
      this.itemForm.markAllAsTouched();
    }
  }
}
