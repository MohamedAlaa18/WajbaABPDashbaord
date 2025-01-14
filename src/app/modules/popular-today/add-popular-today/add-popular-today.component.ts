import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemService } from '@proxy/controllers';
import { IconsComponent } from 'src/app/shared/icons/icons.component';
import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { PopularItemsService } from '@proxy/controllers/popular-items.service';
@Component({
  selector: 'app-add-popular-today',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent],
  templateUrl: './add-popular-today.component.html',
  styleUrl: './add-popular-today.component.scss'
})
export class AddPopularTodayComponent {
  @Input() isOpen: boolean = false;
  @Input() item: any | null = null;
  @Input() items: any[];
  @Output() close = new EventEmitter<void>();

  popularItemForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private popularItemService: PopularItemsService,
    private itemService: ItemService,
  ) {
    this.popularItemForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      prePrice: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      currentPrice: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
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
      maxResultCount: 10
    };

    this.itemService.getList(defaultInput).subscribe({
      next: (response) => {
        console.log(response)
        this.items = response.data.items;
      },
      error: (err) => {
        console.error('Error loading items:', err);
      },
    });
  }

  populateForm(item: any) {
    this.popularItemForm.patchValue({
      id: item.id,
      name: item.name,
      status: item.status,
      prePrice: item.preprice,
      currentPrice: item.currentprice,
      description: item.description,
    });
  }

  closeModal() {
    this.close.emit();
  }

  submitForm() {
    if (this.popularItemForm.valid) {
      // Declare the formValue outside the if-else block
      let formValue: any | any;

      // Determine whether it's an update or create operation
      if (this.popularItemForm.value.id) {
        formValue = this.popularItemForm.value as any;
      } else {
        formValue = this.popularItemForm.value as any;
      }

      console.log(formValue);

      if (this.item) {
        // Update existing branch
        this.popularItemService.update(formValue as any)
          .subscribe(
            response => {
              // Handle successful response
              console.log('Branch updated successfully:', response);
            },
            error => {
              // Handle error response
              console.error('Error updating branch:', error);
            }
          );
      } else {
        // Create a new branch
        this.popularItemService.create(formValue as any)
          .subscribe(
            response => {
              // Handle successful response
              console.log('Branch created successfully:', response);
            },
            error => {
              // Handle error response
              console.error('Error creating branch:', error);
            }
          );
      }
    } else {
      // Mark all form controls as touched to trigger validation messages
      this.popularItemForm.markAllAsTouched();
    }
  }
}
