import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingsSidebarComponent } from "../settings-sidebar/settings-sidebar.component";
import { ThemeService } from '@proxy/controllers';
import { IFormFile } from '@proxy/microsoft/asp-net-core/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-theme',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SettingsSidebarComponent],
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})
export class ThemeComponent implements OnInit {
  themeForm: FormGroup;

  logoFile: File | null = null;
  browserIconFile: File | null = null;
  footerLogoFile: File | null = null;

  logoPreview: string | null = null;
  browserIconPreview: string | null = null;
  footerLogoPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService
  ) {
    this.themeForm = this.fb.group({
      logoFile: [null, Validators.required],
      browserIconFile: [null, Validators.required],
      footerLogoFile: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadOrderSetup();
  }

  loadOrderSetup(): void {
    this.themeService.getById().subscribe(
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

  onFileSelected(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        if (type === 'logo') {
          this.logoPreview = result;
          this.logoFile = file;
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

  onSubmit(): void {
    if (this.themeForm.valid && this.logoFile && this.browserIconFile && this.footerLogoFile) {
      const uploadPromises = [
        this.convertToBase64(this.logoFile).then((base64) => {
          const model = { base64Content: base64, fileName: this.logoFile.name };
          console.log('Sending model for logo:', model);
          return this.themeService.uploadBase64ImageByModel(model).toPromise(); // Convert observable to promise
        }).catch(error => {
          console.error('Error converting logo file to base64:', error);
          throw error; // Re-throw error so the promise chain catches it
        }),

        this.convertToBase64(this.browserIconFile).then((base64) => {
          const model = { base64Content: base64, fileName: this.browserIconFile.name };
          console.log('Sending model for browser icon:', model);
          return this.themeService.uploadBase64ImageByModel(model).toPromise(); // Convert observable to promise
        }).catch(error => {
          console.error('Error converting browser icon file to base64:', error);
          throw error; // Re-throw error
        }),

        this.convertToBase64(this.footerLogoFile).then((base64) => {
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
    } else {
      this.themeForm.markAllAsTouched();
    }
  }

  // Helper method to convert a File to Base64
  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64Content = base64String.split(',')[1]; // Remove the 'data:image/...;' part
        resolve(base64Content); // Resolve with the base64 string without the MIME type
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file); // Read file as Data URL
    });
  }
}
