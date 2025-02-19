import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { SettingsSidebarComponent } from "../settings-sidebar/settings-sidebar.component";
import { CommonModule } from '@angular/common';
import { CompanyService } from '@proxy/controllers';
import { UpdateCompanyDto } from '@proxy/dtos/company-contact';

export function urlValidator(control: AbstractControl): ValidationErrors | null {
  const urlRegex = /^(https?|ftp)?(:\/\/)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+.*$/;
  return urlRegex.test(control.value) ? null : { invalidUrl: true };
}
@Component({
  selector: 'app-company',
  standalone: true,
  imports: [ReactiveFormsModule, SettingsSidebarComponent, CommonModule],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent implements OnInit {
  companyForm: FormGroup;
  companyId: number = 1; // Replace with the actual company ID

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService
  ) {
    this.companyForm = this.fb.group({
      id: [this.companyId],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{7,14}$/)]],
      websiteURL: ['', [Validators.required, urlValidator]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      countryCode: ['', Validators.required],
      zipCode: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadCompanyData();
  }

  loadCompanyData() {
    this.companyService.getById().subscribe({
      next: (response) => {
        console.log(response);
        this.companyForm.patchValue(response.data);
      },
      error: (err) => {
        console.error('Failed to load company data:', err);
      },
    });
  }

  submitForm() {
    if (this.companyForm.valid) {
      // Manually construct the DTO to ensure correct formatting
      const input: UpdateCompanyDto = {
        // id: this.companyForm.value.id,
        name: this.companyForm.value.name.trim(),
        email: this.companyForm.value.email.trim(),
        phone: this.companyForm.value.phone.trim(),
        websiteURL: this.companyForm.value.websiteURL.trim(),
        city: this.companyForm.value.city.trim(),
        state: this.companyForm.value.state.trim(),
        countryCode: this.companyForm.value.countryCode.trim(),
        zipCode: this.companyForm.value.zipCode.trim(),
        address: this.companyForm.value.address.trim(),
      };

      console.log(input);

      // Call the update method from the CompanyService
      this.companyService.update(input).subscribe({
        next: (response) => {
          console.log('Company updated successfully:', response);
        },
        error: (err) => {
          console.error('Error updating company:', err);
        },
      });
    } else {
      this.companyForm.markAllAsTouched();
    }
  }
}
