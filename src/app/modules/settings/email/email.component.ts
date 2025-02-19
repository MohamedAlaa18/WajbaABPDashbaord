import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SiteService } from '@proxy/controllers';
import { SettingsSidebarComponent } from '../settings-sidebar/settings-sidebar.component';
import { CreateSiteDto } from '@proxy/dtos/sites-contact';

@Component({
  selector: 'app-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SettingsSidebarComponent],
  templateUrl: './email.component.html',
  styleUrl: './email.component.scss'
})
export class EmailComponent implements OnInit {
  siteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private siteService: SiteService,
  ) {
    // Initialize the form with default values and validators
    this.siteForm = this.fb.group({
      mailHost: ['', Validators.required],
      mailPort: ['', [Validators.required, Validators.min(1)]],
      mailUserName: ['', Validators.required],
      mailPassword: ['', Validators.required],
      mailFromName: ['', Validators.required],
      mailFromEmail: ['', [Validators.required, Validators.email]],
      mailEncryption: ['ssl', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadSite();
  }

  loadSite(): void {
    this.siteService.getById().subscribe(
      (response) => {
        this.siteForm.patchValue({
          mailHost: response.data.mailHost,
          mailPort: response.data.mailPort,
          mailUserName: response.data.mailUserName,
          mailPassword: response.data.mailPassword,
          mailFromName: response.data.mailFromName,
          mailFromEmail: response.data.mailFromEmail,
          mailEncryption: response.data.mailEncryption || 'ssl',
        });
      },
      (error) => {
        console.error('Error fetching site settings:', error);
      }
    );
  }

  submitForm() {
    if (this.siteForm.valid) {
      const formValue = this.siteForm.value as CreateSiteDto;
      console.log(formValue);
      this.siteService.update(formValue).subscribe({
        next: (response) => {
          console.log('Form submitted successfully!', response);
        },
        error: (error) => {
          console.error('Form submission error:', error);
        }
      });
    } else {
      this.siteForm.markAllAsTouched();
    }
  }
}
