import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IconsComponent } from 'src/app/shared/icons/icons.component';
import { ItemExtraService } from '@proxy/controllers';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { CreateItemExtraDto, UpdateItemExtraDto } from '@proxy/dtos/item-extra-contract';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-extra',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent],
  templateUrl: './add-extra.component.html',
  styleUrl: './add-extra.component.scss'
})
export class AddExtraComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() extra: UpdateItemExtraDto;
  @Input() itemId: number;

  extraForm: FormGroup;
  isEditMode = false;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private itemExtraService: ItemExtraService,
    private afterActionService: AfterActionService,
  ) {
    this.extraForm = this.fb.group({
      extraId: [this.extra?.extraId],
      itemId: [this.itemId],
      name: ['', Validators.required],
      additionalPrice: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      status: [1, Validators.required],
    });
  }

  ngOnInit() {
    this.extraForm.patchValue({ itemId: this.itemId }); // Ensure itemId is always set

    if (this.extra) {
      this.isEditMode = true;
      this.extraForm.patchValue(this.extra);
      this.populateForm(this.extra);
    }
  }

  populateForm(extra: any) {
    console.log('Populating form:', extra);
    this.extraForm.patchValue({
      extraId: extra.id,
      itemId: this.itemId,
      name: extra.name,
      additionalPrice: extra.additionalPrice,
      status: extra.status,
    });
  }

  saveExtra() {
    this.handleFormSubmission(this.extraForm, this.itemExtraService, this.isEditMode, 'Extra');
  }

  private handleFormSubmission(form: FormGroup, service: any, isEditMode: boolean, entityName: string) {
    if (form.invalid) {
      console.log(`Form is invalid:`, form);
      form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = form.value;

    const request$ = isEditMode
      ? service.updateExtraForItem(formValue)
      : service.create(formValue);

    this.handleSubmission(request$, entityName);
  }

  private handleSubmission(request$: Observable<any>, entityName: string) {
    request$.subscribe({
      next: (response) => {
        console.log(`${entityName} ${this.isEditMode ? 'updated' : 'created'} successfully`, response);
        this.closeModal();
        this.afterActionService.reloadCurrentRoute();
      },
      error: (error) => {
        console.error(`Error ${this.isEditMode ? 'updating' : 'creating'} ${entityName}:`, error);
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  closeModal() {
    this.close.emit();
  }
}
