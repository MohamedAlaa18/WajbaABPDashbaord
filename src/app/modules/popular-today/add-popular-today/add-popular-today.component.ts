import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemService } from '@proxy/controllers';
import { IconsComponent } from 'src/app/shared/icons/icons.component';
import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { PopularItemsService } from '@proxy/controllers/popular-items.service';
import { ItemDto } from '@proxy/dtos/items-dtos';
import { CreatePopularitem, UpdatePopularItemdto } from '@proxy/dtos/popular-itemstoday';
import { Base64Service } from 'src/app/services/base64/base64.service';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';

@Component({
  selector: 'app-add-popular-today',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent],
  templateUrl: './add-popular-today.component.html',
  styleUrls: ['./add-popular-today.component.scss'],
})
export class AddPopularTodayComponent {
  @Input() isOpen: boolean = false;
  @Input() item: UpdatePopularItemdto | null = null;
  @Input() items: ItemDto[];
  @Output() close = new EventEmitter<void>();

  popularItemForm: FormGroup;
  selectedImageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private popularItemService: PopularItemsService,
    private itemService: ItemService,
    private base64Service: Base64Service,
    private afterActionService: AfterActionService,
  ) {
    this.popularItemForm = this.fb.group({
      id: [null],
      itemId: ['', Validators.required],
      preprice: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      currentprice: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      description: ['', Validators.required],
      image: [''],
    });
  }

  ngOnInit(): void {
    this.loadItems();

    if (this.item) {
      this.populateForm(this.item);
    }
  }

  loadItems(): void {
    const defaultInput: PagedAndSortedResultRequestDto = {
      sorting: '',
      skipCount: 0,
      maxResultCount: 10,
    };

    this.itemService.getList(defaultInput).subscribe({
      next: (response) => {
        this.items = response.data.items;
      },
      error: (err) => {
        console.error('Error loading items:', err);
      },
    });
  }

  populateForm(item: UpdatePopularItemdto) {
    this.popularItemForm.patchValue({
      id: item.id,
      preprice: item.preprice,
      currentprice: item.currentprice,
      description: item.description,
    });
  }

  handleImageUpload(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedImageFile = fileInput.files[0];
    }
  }

  closeModal() {
    this.close.emit();
  }

  submitForm() {
    if (this.popularItemForm.valid) {
      if (this.selectedImageFile) {
        // Convert image to Base64
        this.base64Service.convertToBase64(this.selectedImageFile).then((base64Content) => {
          const formValue: CreatePopularitem | UpdatePopularItemdto = {
            ...this.popularItemForm.value,
            model: {
              id: this.item?.id || 0, // Use existing ID if updating
              fileName: this.selectedImageFile?.name || '',
              base64Content: base64Content
            }
          };

          console.log('Form value:', formValue as CreatePopularitem);
          // Determine create or update operation
          if (this.item) {
            this.updateItem(formValue as UpdatePopularItemdto);
          } else {
            this.createItem(formValue as CreatePopularitem);
          }
        }).catch((error) => {
          console.error('Error converting image to Base64:', error);
        });
      } else {
        console.error('No image file selected. Please select an image.');
      }
    } else {
      // Mark all form controls as touched to trigger validation messages
      this.popularItemForm.markAllAsTouched();
    }
  }

  private createItem(createDto: CreatePopularitem) {
    this.popularItemService.create(createDto)
      .subscribe(
        (response) => {
          console.log('Item created successfully:', response);
          this.afterActionService.reloadCurrentRoute();
          this.closeModal();
        },
        (error) => {
          console.error('Error creating Item:', error);
        }
      );
  }

  private updateItem(updateDto: UpdatePopularItemdto) {
    this.popularItemService.update(updateDto)
      .subscribe(
        (response) => {
          console.log('Item updated successfully:', response);
          this.afterActionService.reloadCurrentRoute();
          this.closeModal();
        },
        (error) => {
          console.error('Error updating Item:', error);
        }
      );
  }
}
