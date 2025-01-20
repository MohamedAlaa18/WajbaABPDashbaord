import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ItemService } from '@proxy/controllers';
import { CreateItemDto, UpdateItemDTO} from '@proxy/dtos/items-dtos';
import { IconsComponent } from 'src/app/shared/icons/icons.component';

@Component({
  selector: 'app-add-vouchers',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent, NgSelectModule],
  templateUrl: './add-vouchers.component.html',
  styleUrl: './add-vouchers.component.scss'
})
export class AddVouchersComponent {
  @Input() isOpen: boolean = false;
  @Input() item: UpdateItemDTO| null = null;
  @Output() close = new EventEmitter<void>();

  voucherForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
  ) {
    this.voucherForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      discount: ['', Validators.required],
      limitPerUser: ['',],
      discountType: ['', Validators.required],
      startDate: ['',],
      endDate: ['',],
      minDiscount: ['',],
      maxDiscount: ['', Validators.required],
      description: [''],
      image: [''],
    });
  }

  ngOnInit(): void {

    if (this.item) {
      this.populateForm(this.item);
    }
  }

  populateForm(item: UpdateItemDTO) {
    this.voucherForm.patchValue({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.categoryId,
      tax: item.taxValue,
      itemType: item.itemType,
      status: item.status,
      isFeatured: item.isFeatured,
      // image: item.imageUrl,
      description: item.description,
      note: item.note,
      // branches: item.branchIds || [], // Populate selected branches (multiple selections)
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.voucherForm.patchValue({ image: file });
    }
  }

  closeModal() {
    this.close.emit();
  }

  submitForm() {
    if (this.voucherForm.valid) {
      let formValue: CreateItemDto| UpdateItemDTO;

      // Determine whether it's an update or create operation
      if (this.voucherForm.value.id) {
        formValue = this.voucherForm.value as UpdateItemDTO;
      } else {
        formValue = this.voucherForm.value as CreateItemDto;
      }

      if (this.item) {
        // Update existing item
        this.itemService.update(formValue as UpdateItemDTO)
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
      this.voucherForm.markAllAsTouched();
    }
  }
}
