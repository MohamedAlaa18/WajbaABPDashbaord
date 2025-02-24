import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LanguageService } from '@proxy/controllers';
import { CreateBranchDto } from '@proxy/dtos/branch-contract';
import { IconsComponent } from "../../../../shared/icons/icons.component";
import { CommonModule } from '@angular/common';
import { CreateUpdateLanguageDto, UpdateLanguagedto } from '@proxy/dtos/languages';
import { Base64Service } from 'src/app/services/base64/base64.service';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';

@Component({
  selector: 'app-add-languages',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent],
  templateUrl: './add-languages.component.html',
  styleUrl: './add-languages.component.scss'
})
export class AddLanguagesComponent {
  @Input() isOpen: boolean = false;
  @Input() language: UpdateLanguagedto | null = null;
  @Output() close = new EventEmitter<void>();

  languageForm: FormGroup;
  selectedImageFile: File | null = null;
  isSubmitting: boolean = false; // Prevent multiple submissions

  constructor(
    private fb: FormBuilder,
    private languageService: LanguageService,
    private base64Service: Base64Service,
    private afterActionService:AfterActionService
  ) {
    this.languageForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      image: [null, Validators.required],
      code: ['', Validators.required],
      status: [1],
    });
  }

  ngOnInit(): void {
    if (this.language) {
      this.populateForm(this.language);
    }
  }

  populateForm(language: UpdateLanguagedto) {
    this.languageForm.patchValue({
      id: language.id,
      name: language.name,
      code: language.code,
      // image: language.image,
      status: language.status,
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
    if (this.languageForm.invalid) {
      this.languageForm.markAllAsTouched();
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
        const formValue: CreateUpdateLanguageDto | UpdateLanguagedto = {
          ...this.languageForm.value,
          model: {
            id: this.language?.id || 0, // Use existing ID if updating
            fileName: this.selectedImageFile.name || '',
            base64Content
          }
        };

        const request$ = this.language
          ? this.languageService.upadteByUpdate(formValue as UpdateLanguagedto)
          : this.languageService.createasyncByLanguageDto(formValue as CreateUpdateLanguageDto);

        request$.subscribe({
          next: (response) => {
            console.log(`Language ${this.language ? 'updated' : 'created'} successfully:`, response);
            this.closeModal();
            this.afterActionService.reloadCurrentRoute();
          },
          error: (error) => {
            console.error(`Error ${this.language ? 'updating' : 'creating'} language:`, error);
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
}
