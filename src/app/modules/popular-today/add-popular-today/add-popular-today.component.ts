import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemService } from '@proxy/controllers';
import { IconsComponent } from 'src/app/shared/icons/icons.component';
import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { PopularItemsService } from '@proxy/controllers/popular-items.service';
import { ItemDto } from '@proxy/dtos/items-dtos';
import { CreatePopularitem, Popularitemdto, UpdatePopularItemdto } from '@proxy/dtos/popular-itemstoday';
import { Base64Service } from 'src/app/services/base64/base64.service';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { priceComparisonValidator } from 'src/app/validators/priceComparisonValidator';

@Component({
  selector: 'app-add-popular-today',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent],
  templateUrl: './add-popular-today.component.html',
  styleUrls: ['./add-popular-today.component.scss'],
})
export class AddPopularTodayComponent {
  @Input() isOpen: boolean = false;
  @Input() item: Popularitemdto | null = null;
  @Input() items: ItemDto[];
  @Output() close = new EventEmitter<void>();

  popularItemForm: FormGroup;
  selectedImageFile: File | null = null;
  selectedItem: ItemDto;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private popularItemService: PopularItemsService,
    private itemService: ItemService,
    private base64Service: Base64Service,
    private afterActionService: AfterActionService,
  ) {
    this.popularItemForm = this.fb.group(
      {
        id: [null],
        itemId: ['', Validators.required],
        prePrice: ['', [Validators.pattern('^[0-9]*$')]],
        currentPrice: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
        description: ['', Validators.required],
        image: [''],
      },
      {
        validators: priceComparisonValidator()  // Apply the custom validator here
      }
    );
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

  loadItem(): void {
    const itemId = this.popularItemForm.get('itemId')?.value;
    if (!itemId) return;

    this.itemService.get(itemId).subscribe(
      (response) => {
        this.selectedItem = response.data;
        this.popularItemForm.patchValue({
          prePrice: this.selectedItem.price,
        });
      },
      (error) => {
        console.error('Error loading item:', error);
      }
    );
  }

  populateForm(item: Popularitemdto) {
    this.popularItemForm.patchValue({
      id: item.id,
      itemId: item.itemId,
      prePrice: item.prePrice,
      currentPrice: item.currentPrice,
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

  submitForm(): void {
    if (this.popularItemForm.invalid) {
      this.popularItemForm.markAllAsTouched();
      return;
    }

    const formValues = { ...this.popularItemForm.value };

    this.isSubmitting = true; // Prevent multiple submissions

    const processPopularItem = (base64Content: string | null) => {
      const itemDto = {
        ...formValues,
        model: base64Content
          ? { id: this.item?.id || 0, fileName: this.selectedImageFile?.name || '', base64Content }
          : null
      };

      const request$ = this.item
        ? this.popularItemService.update(itemDto as UpdatePopularItemdto)
        : this.popularItemService.create(itemDto as CreatePopularitem);

      request$.subscribe({
        next: (response) => {
          console.log(`Popular item ${this.item ? 'updated' : 'added'} successfully:`, response);
          this.closeModal();
          this.afterActionService.reloadCurrentRoute();
        },
        error: (error) => {
          console.error(`Error ${this.item ? 'updating' : 'adding'} popular item:`, error);
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    };

    if (this.selectedImageFile) {
      this.base64Service.convertToBase64(this.selectedImageFile)
        .then(processPopularItem)
        .catch((error: any) => {
          console.error('Error converting image to Base64:', error);
          this.isSubmitting = false;
        });
    } else {
      processPopularItem(null);
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
