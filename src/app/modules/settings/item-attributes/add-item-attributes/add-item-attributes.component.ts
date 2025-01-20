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
    if (this.itemAttributeForm.valid) {
      let formValue: UpdateItemAttributeDto | CreateItemAttributeDto;

      if (this.itemAttributeForm.value.id) {
        formValue = this.itemAttributeForm.value as UpdateItemAttributeDto;
      } else {
        formValue = this.itemAttributeForm.value as CreateItemAttributeDto;
      }

      if (this.itemAttribute) {
        // Update existing itemAttribute
        this.itemAttributeService.update(formValue as UpdateItemAttributeDto)
          .subscribe(
            response => {
              console.log('Item attribute updated successfully:', response);
              // Emit 'saved' result to the parent component
              this.close.emit();
            },
            error => {
              console.error('Error updating item attribute:', error);
            }
          );
      } else {
        // Create a new itemAttribute
        this.itemAttributeService.create(formValue as CreateItemAttributeDto)
          .subscribe(
            response => {
              console.log('Item attribute created successfully:', response);
              // Emit 'saved' result to the parent component
              this.close.emit();
            },
            error => {
              console.error('Error creating item attribute:', error);
            }
          );
      }
    } else {
      this.itemAttributeForm.markAllAsTouched();
    }
  }

  closeMapModal() {
    this.isMapModalOpen = false;
  }
}
