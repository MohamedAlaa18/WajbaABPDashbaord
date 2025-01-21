import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LanguageService } from '@proxy/controllers';
import { CreateBranchDto } from '@proxy/dtos/branch-contract';
import { IconsComponent } from "../../../../shared/icons/icons.component";
import { CommonModule } from '@angular/common';
import { CreateUpdateLanguageDto, UpdateLanguagedto } from '@proxy/dtos/languages';
import { Base64Service } from 'src/app/services/base64/base64.service';

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

  constructor(
    private fb: FormBuilder,
    private languageService: LanguageService,
    private base64Service: Base64Service,
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
    if (this.languageForm.valid) {
      // Ensure status is valid (either 1 or 2)
      // const status = this.languageForm.value.status;
      // if (![1, 2].includes(status)) {
      //   console.error('Invalid status value');
      //   return;
      // }

      if (this.selectedImageFile) {
        // Convert image to Base64
        this.base64Service.convertToBase64(this.selectedImageFile).then((base64Content) => {
          const formValue: CreateUpdateLanguageDto | UpdateLanguagedto = {
            ...this.languageForm.value,
            model: {
              id: this.language?.id || 0, // Use existing ID if updating
              fileName: this.selectedImageFile?.name || '',
              base64Content: base64Content
            }
          };

          // Determine create or update operation
          if (this.language) {
            this.updateLanguage(formValue as UpdateLanguagedto);
          } else {
            this.createLanguage(formValue as CreateUpdateLanguageDto);
          }
        }).catch((error) => {
          console.error('Error converting image to Base64:', error);
        });
      } else {
        console.error('No image file selected. Please select an image.');
      }
    } else {
      // Mark all form controls as touched to trigger validation messages
      this.languageForm.markAllAsTouched();
    }
  }

  private createLanguage(createDto: CreateUpdateLanguageDto) {
    this.languageService.createasyncByLanguageDto(createDto)
      .subscribe(
        (response) => {
          console.log('Item Language created successfully:', response);
          this.closeModal();
        },
        (error) => {
          console.error('Error creating Item Language:', error);
        }
      );
  }

  private updateLanguage(updateDto: UpdateLanguagedto) {
    this.languageService.upadteByUpdate(updateDto)
      .subscribe(
        (response) => {
          console.log('Item Language updated successfully:', response);
          this.closeModal();
        },
        (error) => {
          console.error('Error updating Item Language:', error);
        }
      );
  }
}
