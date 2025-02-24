import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemAttributeService } from '@proxy/controllers';
import { CreateItemAttributeDto, UpdateItemAttributeDto } from '@proxy/dtos/item-attributes';
import { IconsComponent } from 'src/app/shared/icons/icons.component';

@Component({
  selector: 'app-add-item-attributes',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent],
  templateUrl: './add-item-attributes.component.html',
  styleUrl: './add-item-attributes.component.scss'
})
export class AddItemAttributesComponent {
  @Input() isOpen: boolean = false;
  @Input() itemAttribute: UpdateItemAttributeDto | null = null;
  @Output() close = new EventEmitter<void>();

  itemAttributeForm: FormGroup;
  isSubmitting: boolean = false; // Prevent multiple submissions
  isMapModalOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private itemAttributeService: ItemAttributeService,
  ) {
    this.itemAttributeForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      status: [1],
    });
  }

  ngOnInit(): void {
    if (this.itemAttribute) {
      this.populateForm(this.itemAttribute);
    }
  }

  populateForm(itemAttribute: UpdateItemAttributeDto) {
    this.itemAttributeForm.patchValue({
      id: itemAttribute.id,
      name: itemAttribute.name,
      status: itemAttribute.status
    });
  }

  closeModal() {
    this.close.emit();
  }

  submitForm() {
    if (this.itemAttributeForm.invalid || this.isSubmitting) {
      this.itemAttributeForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true; // Disable further clicks

    let formValue: UpdateItemAttributeDto | CreateItemAttributeDto =
      this.itemAttributeForm.value.id
        ? (this.itemAttributeForm.value as UpdateItemAttributeDto)
        : (this.itemAttributeForm.value as CreateItemAttributeDto);

    const request = this.itemAttribute
      ? this.itemAttributeService.update(formValue as UpdateItemAttributeDto)
      : this.itemAttributeService.create(formValue as CreateItemAttributeDto);

    request.subscribe({
      next: (response) => {
        console.log('Item attribute saved successfully:', response);
        this.close.emit();
      },
      error: (error) => {
        console.error('Error saving item attribute:', error);
      },
      complete: () => {
        this.isSubmitting = false; // Re-enable button after request completes
      }
    });
  }
}
