import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '@proxy/controllers';
import { IconsComponent } from "../../../../shared/icons/icons.component";
import { CommonModule } from '@angular/common';
import { CreateUpdateCategoryDto, UpdateCategory } from '@proxy/dtos/categories';
import { Base64Service } from 'src/app/services/base64/base64.service';

@Component({
  selector: 'app-add-item-categories',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent],
  templateUrl: './add-item-categories.component.html',
  styleUrl: './add-item-categories.component.scss'
})
export class AddItemCategoriesComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() itemCategory: UpdateCategory | null = null;
  @Output() close = new EventEmitter<void>();

  itemCategoryForm: FormGroup;
  isMapModalOpen: boolean = false;
  selectedImageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private base64Service: Base64Service,
  ) {
    this.itemCategoryForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      image: [null, Validators.required],
      description: ['', Validators.required],
      status: [1],
    });
  }

  ngOnInit(): void {
    console.log('Item Category:', this.itemCategory);
    if (this.itemCategory) {
      this.populateForm(this.itemCategory);
    }
  }

  populateForm(itemCategory: UpdateCategory) {
    this.itemCategoryForm.patchValue({
      id: itemCategory.id,
      name: itemCategory.name,
      description: itemCategory.description,
      status: itemCategory.status,
    });
  }

  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImageFile = input.files[0];
    }
  }

  closeModal() {
    this.close.emit();
  }

  submitForm() {
    if (this.itemCategoryForm.valid) {
      // Ensure status is valid (either 1 or 2)
      // const status = this.itemCategoryForm.value.status;
      // if (![1, 2].includes(status)) {
      //   console.error('Invalid status value');
      //   return;
      // }

      if (this.selectedImageFile) {
        // Convert image to Base64
        this.base64Service.convertToBase64(this.selectedImageFile).then((base64Content) => {
          const formValue: CreateUpdateCategoryDto | UpdateCategory = {
            ...this.itemCategoryForm.value,
            model: {
              id: this.itemCategory?.id || 0, // Use existing ID if updating
              fileName: this.selectedImageFile?.name || '',
              base64Content: base64Content
            }
          };

          // Determine create or update operation
          if (this.itemCategory) {
            this.updateCategory(formValue as UpdateCategory);
          } else {
            this.createCategory(formValue as CreateUpdateCategoryDto);
          }
        }).catch((error) => {
          console.error('Error converting image to Base64:', error);
        });
      } else {
        console.error('No image file selected. Please select an image.');
      }
    } else {
      // Mark all form controls as touched to trigger validation messages
      this.itemCategoryForm.markAllAsTouched();
    }
  }

  private createCategory(createDto: CreateUpdateCategoryDto) {
    this.categoryService.create(createDto)
      .subscribe(
        (response) => {
          console.log('Item Category created successfully:', response);
          this.closeModal();
        },
        (error) => {
          console.error('Error creating Item Category:', error);
        }
      );
  }

  private updateCategory(updateDto: UpdateCategory) {
    this.categoryService.update(updateDto)
      .subscribe(
        (response) => {
          console.log('Item Category updated successfully:', response);
          this.closeModal();
        },
        (error) => {
          console.error('Error updating Item Category:', error);
        }
      );
  }

  closeMapModal() {
    this.isMapModalOpen = false;
  }
}
