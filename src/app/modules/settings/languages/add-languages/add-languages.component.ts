import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LanguageService } from '@proxy/controllers';
import { CreateBranchDto } from '@proxy/dtos/branch-contract';
import { IconsComponent } from "../../../../shared/icons/icons.component";
import { CommonModule } from '@angular/common';
import { CreateUpdateLanguageDto, UpdateLanguagedto } from '@proxy/dtos/languages';

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
  isMapModalOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private languageService: LanguageService,
  ) {
    this.languageForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      image: [null, Validators.required],
      code: ['', Validators.required],
      status: ['active'],
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
      image: language.image,
      status: language.status,
    });
  }

  closeModal() {
    this.close.emit();
  }

  submitForm() {
    if (this.languageForm.valid) {
      // Declare the formValue outside the if-else block
      let formValue: CreateBranchDto | UpdateLanguagedto;

      // Determine whether it's an update or create operation
      if (this.languageForm.value.id) {
        formValue = this.languageForm.value as UpdateLanguagedto;
      } else {
        formValue = this.languageForm.value as CreateBranchDto;
      }

      console.log(formValue);

      if (this.language) {
        // Update existing Language
        this.languageService.upadteByUpdate(formValue as UpdateLanguagedto)
          .subscribe(
            response => {
              // Handle successful response
              console.log('Language updated successfully:', response);
            },
            error => {
              // Handle error response
              console.error('Error updating Language:', error);
            }
          );
      } else {
        // Create a new branch
        this.languageService.createasyncByLanguageDto(formValue as CreateUpdateLanguageDto)
          .subscribe(
            response => {
              // Handle successful response
              console.log('Language created successfully:', response);
            },
            error => {
              // Handle error response
              console.error('Error creating Language:', error);
            }
          );
      }
    } else {
      // Mark all form controls as touched to trigger validation messages
      this.languageForm.markAllAsTouched();
    }
  }

  closeMapModal() {
    this.isMapModalOpen = false;
  }
}
