import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '@proxy/controllers';
import { IconsComponent } from "../../../../shared/icons/icons.component";
import { CommonModule } from '@angular/common';
import { CreateUpdateCategoryDto, UpdateCategory } from '@proxy/dtos/categories';
import { Base64Service } from 'src/app/services/base64/base64.service';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';

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
  isSubmitting: boolean = false; // Prevent multiple submissions

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private base64Service: Base64Service,
    private afterActionService: AfterActionService,
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
    if (this.itemCategoryForm.invalid) {
      this.itemCategoryForm.markAllAsTouched();
      return;
    }

    if (!this.selectedImageFile) {
      console.error('No image file selected. Please select an image.');
      return;
    }

    this.isSubmitting = true; // Prevent multiple submissions

    // Convert image to Base64
    this.base64Service.convertToBase64(this.selectedImageFile)
      .then((base64Content) => {
        const formValue: CreateUpdateCategoryDto | UpdateCategory = {
          ...this.itemCategoryForm.value,
          model: {
            id: this.itemCategory?.id || 0, // Use existing ID if updating
            fileName: this.selectedImageFile.name || '',
            base64Content
          }
        };

        const request$ = this.itemCategory
          ? this.categoryService.update(formValue as UpdateCategory)
          : this.categoryService.create(formValue as CreateUpdateCategoryDto);

        request$.subscribe({
          next: (response) => {
            console.log(`Category ${this.itemCategory ? 'updated' : 'created'} successfully:`, response);
            this.closeModal();
            this.afterActionService.reloadCurrentRoute();
          },
          error: (error) => {
            console.error(`Error ${this.itemCategory ? 'updating' : 'creating'} category:`, error);
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
      })
      .catch((error) => {
        console.error('Error converting image to Base64:', error);
        this.isSubmitting = false;
      });
  }

  closeMapModal() {
    this.isMapModalOpen = false;
  }
}
