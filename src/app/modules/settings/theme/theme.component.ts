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
      // Convert each file to Base64 and upload using the themeService
      const uploadPromises = [
        this.convertToBase64(this.logoFile).then((base64) => {
          console.log('Logo Base64:', base64); // Debug log
          return this.themeService.uploadBase64ImageByModel({ base64Content: base64, fileName: this.logoFile.name });
        }),
        this.convertToBase64(this.browserIconFile).then((base64) => {
          console.log('Browser Icon Base64:', base64); // Debug log
          return this.themeService.uploadBase64ImageByModel({ base64Content: base64, fileName: this.browserIconFile.name });
        }),
        this.convertToBase64(this.footerLogoFile).then((base64) => {
          console.log('Footer Logo Base64:', base64); // Debug log
          return this.themeService.uploadBase64ImageByModel({ base64Content: base64, fileName: this.footerLogoFile.name });
        }),
      ];

      // Handle all upload operations
      Promise.all(uploadPromises)
        .then((responses) => {
          console.log('Upload responses:', responses); // Debug log
          // Reset the form and files after successful submission
          this.themeForm.reset();
          this.logoFile = null;
          this.browserIconFile = null;
          this.footerLogoFile = null;
        })
        .catch((error) => {
          console.error('Error uploading images:', error);
        });
    } else {
      this.themeForm.markAllAsTouched();
    }
  }


  // Helper method to convert a File to Base64
  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string); // Resolve with Base64 string
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file); // Read file as Data URL
    });
  }

  convertFileToIFormFile(file: File): IFormFile {
    // Convert HttpHeaders to a plain object
    const headersObj: Record<string, string[]> = {};
    // Example: You can populate headers if necessary, like this:
    // headersObj['Content-Type'] = [file.type];

    // Create an object resembling IFormFile structure
    const iFormFile: IFormFile = {
      headers: headersObj,  // Use the plain object for headers
      length: file.size,
      name: file.name,
      contentType: file.type,
    };

    return iFormFile;
  }
}
