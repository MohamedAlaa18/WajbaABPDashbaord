import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BranchService, CategoryService, ItemService, ItemTaxService } from '@proxy/controllers';
import { CreateBranchDto, GetBranchInput, UpdateBranchDto } from '@proxy/dtos/branch-contract';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { IconsComponent } from "../../../shared/icons/icons.component";
import { CreateUpdateCategoryDto } from '@proxy/dtos/categories';
import { UpdateItemTaxDto } from '@proxy/dtos/item-tax-contract';
import { CreateItemDto, UpdateItemDTO } from '@proxy/dtos/items-dtos';
import { Base64Service } from 'src/app/services/base64/base64.service';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
@Component({
  selector: 'app-add-items',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent, NgSelectModule],
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.scss']
})
export class AddItemsComponent {
  @Input() isOpen: boolean = false;
  @Input() item: UpdateItemDTO | null = null;
  @Output() close = new EventEmitter<void>();
  selectedBranches: number[] = []; // Array to hold selected branch IDs

  itemForm: FormGroup;
  categories: CreateUpdateCategoryDto[] = [];
  branchesList: CreateBranchDto[] = [];
  taxes: UpdateItemTaxDto[] = [];
  selectedImageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private branchService: BranchService,
    private categoryService: CategoryService,
    private itemTaxService: ItemTaxService,
    private base64Service: Base64Service,
    private afterActionService: AfterActionService,
  ) {
    this.itemForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      taxValue: [''],
      itemType: [1, Validators.required],
      status: [1, Validators.required],
      branchIds: this.fb.control([], Validators.required),
      isFeatured: [true, Validators.required],
      image: ['', Validators.required],
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

  populateForm(item: UpdateItemDTO) {
    console.log(item);
    this.itemForm.patchValue({
      id: item.id,
      name: item.name,
      price: item.price,
      categoryId: item.categoryId,
      taxValue: item.taxValue,
      itemType: item.itemType,
      status: item.status,
      isFeatured: item.isFeatured,
      // image: item.imageUrl,
      description: item.description,
      note: item.note,
      branchIds: item.branchIds || [],
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
      next: (branches) => {
        this.branchesList = branches.data.items;
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
        this.taxes = response.data.items;
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

  handleImageUpload(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedImageFile = fileInput.files[0];
    }
  }

  submitForm() {
    if (this.itemForm.valid) {
      if (this.selectedImageFile) {
        // Convert image to Base64
        this.base64Service.convertToBase64(this.selectedImageFile).then((base64Content) => {
          const formValue: CreateItemDto | UpdateItemDTO = {
            ...this.itemForm.value,
            model: {
              id: this.item?.id || 0, // Use existing ID if updating
              fileName: this.selectedImageFile?.name || '',
              base64Content: base64Content
            }
          };
          console.log(formValue);
          // Determine create or update operation
          if (this.item) {
            this.updateItem(formValue as UpdateItemDTO);
          } else {
            this.createItem(formValue as CreateItemDto);
          }
        }).catch((error) => {
          console.error('Error converting image to Base64:', error);
        });
      } else {
        console.error('No image file selected. Please select an image.');
      }
    } else {
      // Mark all form controls as touched to trigger validation messages
      this.itemForm.markAllAsTouched();
    }
  }

  private createItem(createDto: CreateItemDto) {
    this.itemService.create(createDto)
      .subscribe(
        (response) => {
          console.log('Item created successfully:', response);
          this.closeModal();
          this.afterActionService.reloadCurrentRoute();
        },
        (error) => {
          console.error('Error creating Item:', error);
        }
      );
  }

  private updateItem(updateDto: UpdateItemDTO) {
    this.itemService.update(updateDto)
      .subscribe(
        (response) => {
          console.log('Item updated successfully:', response);
          this.closeModal();
          this.afterActionService.reloadCurrentRoute();

        },
        (error) => {
          console.error('Error updating Item:', error);
        }
      );
  }
}
