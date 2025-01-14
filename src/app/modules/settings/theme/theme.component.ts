import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ThemeService } from '@proxy/controllers';
<<<<<<< Updated upstream
import { SettingsSidebarComponent } from "../settings-sidebar/settings-sidebar.component";
=======
import { IFormFile } from '@proxy/microsoft/asp-net-core/http';
import { HttpHeaders } from '@angular/common/http';
import { Base64Service } from 'src/app/services/base64/base64.service';
>>>>>>> Stashed changes

@Component({
  selector: 'app-theme',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SettingsSidebarComponent],
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.scss'
})
export class ThemeComponent {
  themeForm: FormGroup;
  logoPreview: string | null = null;
  browserIconPreview: string | null = null;
  footerLogoPreview: string | null = null;

  logoFile!: File; // Store files separately
  browserIconFile!: File;
  footerLogoFile!: File;

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService,
    private base64Service: Base64Service
  ) {
    this.themeForm = this.fb.group({
      logoFile: [null, Validators.required],
      browserIconFile: [null, Validators.required],
      footerLogoFile: [null, Validators.required]
    });
  }

<<<<<<< Updated upstream
  // Handles file selection and preview generation
=======
  ngOnInit(): void {
    this.loadOrderSetup();
  }

  loadOrderSetup(): void {
    this.themeService.get().subscribe(
      (response: any) => {
        console.log("Response:", response);
        this.logoPreview = response.data.logoUrl;
        this.browserIconPreview = response.data.browserTabIconUrl;
        this.footerLogoPreview = response.data.footerLogoUrl;
      },
      (error) => {
        console.error('Error fetching order setup data', error);
      }
    );
  }

>>>>>>> Stashed changes
  onFileSelected(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        if (type === 'logo') {
          this.logoPreview = result;
          this.logoFile = file; // Store file separately
        } else if (type === 'browserIcon') {
          this.browserIconPreview = result;
          this.browserIconFile = file;
        } else if (type === 'footerLogo') {
          this.footerLogoPreview = result;
          this.footerLogoFile = file;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // Submit the form data using the ThemeService
  onSubmit(): void {
<<<<<<< Updated upstream
    if (this.themeForm.valid) {
      // Submit the files stored separately
      // this.themeService.update(this.logoFile, this.browserIconFile, this.footerLogoFile).subscribe(
      //   response => {
      //     console.log('Theme updated successfully:', response);
      //     this.themeForm.reset();
      //   },
      //   error => {
      //     console.error('Error updating theme:', error);
      //   }
      // );
=======
    if (this.themeForm.valid && this.logoFile && this.browserIconFile && this.footerLogoFile) {
      const uploadPromises = [
        this.base64Service.convertToBase64(this.logoFile).then((base64) => {
          const model = { base64Content: base64, fileName: this.logoFile.name };
          console.log('Sending model for logo:', model);
          return this.themeService.uploadBase64ImageByModel(model).toPromise(); // Convert observable to promise
        }).catch(error => {
          console.error('Error converting logo file to base64:', error);
          throw error; // Re-throw error so the promise chain catches it
        }),

        this.base64Service.convertToBase64(this.browserIconFile).then((base64) => {
          const model = { base64Content: base64, fileName: this.browserIconFile.name };
          console.log('Sending model for browser icon:', model);
          return this.themeService.uploadBase64ImageByModel(model).toPromise(); // Convert observable to promise
        }).catch(error => {
          console.error('Error converting browser icon file to base64:', error);
          throw error; // Re-throw error
        }),

        this.base64Service.convertToBase64(this.footerLogoFile).then((base64) => {
          const model = { base64Content: base64, fileName: this.footerLogoFile.name };
          console.log('Sending model for footer logo:', model);
          return this.themeService.uploadBase64ImageByModel(model).toPromise(); // Convert observable to promise
        }).catch(error => {
          console.error('Error converting footer logo file to base64:', error);
          throw error; // Re-throw error
        }),
      ];

      Promise.all(uploadPromises)
        .then((responses) => {
          console.log('Upload responses:', responses);
          if (responses.every((response) => response.success)) {
            console.log('All images uploaded successfully.');
          } else {
            console.error('Some uploads failed:', responses);
          }
        })
        .catch((error) => {
          console.error('Error during upload process:', error); // Log errors
        });
>>>>>>> Stashed changes
    } else {
      this.themeForm.markAllAsTouched();
    }
  }
}
