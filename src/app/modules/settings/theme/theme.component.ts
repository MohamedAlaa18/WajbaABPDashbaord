import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ThemeService } from '@proxy/controllers';
import { SettingsSidebarComponent } from '../settings-sidebar/settings-sidebar.component';
import { Base64Service } from 'src/app/services/base64/base64.service';
import { CreateThemesDto, UpdateThemeDto } from '@proxy/dtos/themes-contract';

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
    private themeService: ThemeService,
    private base64Service: Base64Service
  ) {
    this.themeForm = this.fb.group({
      logoFile: [null, Validators.required],
      browserIconFile: [null, Validators.required],
      footerLogoFile: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTheme();
  }

  loadTheme(): void {
    this.themeService.getByIdById(1).subscribe(
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
      // Initialize an empty DTO
      const themesDto: UpdateThemeDto = {
        id: 1,
        logoUrl: null,
        browserTabIconUrl: null,
        footerLogoUrl: null,
      };

      // Convert all files to base64 and build the themesDto object
      const uploadPromises = [
        this.base64Service.convertToBase64(this.logoFile).then((base64) => {
          themesDto.logoUrl = { base64Content: base64, fileName: this.logoFile.name };
        }).catch((error) => {
          console.error('Error converting logo file to base64:', error);
          throw error;
        }),

        this.base64Service.convertToBase64(this.browserIconFile).then((base64) => {
          themesDto.browserTabIconUrl = { base64Content: base64, fileName: this.browserIconFile.name };
        }).catch((error) => {
          console.error('Error converting browser icon file to base64:', error);
          throw error;
        }),

        this.base64Service.convertToBase64(this.footerLogoFile).then((base64) => {
          themesDto.footerLogoUrl = { base64Content: base64, fileName: this.footerLogoFile.name };
        }).catch((error) => {
          console.error('Error converting footer logo file to base64:', error);
          throw error;
        }),
      ];

      // Wait for all promises to complete
      Promise.all(uploadPromises)
        .then(() => {
          console.log('All files converted to base64 successfully:', themesDto);
          // Call the update API with the constructed themesDto
          this.themeService.update(themesDto).subscribe({
            next: (response) => {
              console.log('Themes updated successfully:', response);
            },
            error: (error) => {
              console.error('Error updating themes:', error);
            },
          });
        })
        .catch((error) => {
          console.error('Error during the file conversion process:', error);
        });
    } else {
      this.themeForm.markAllAsTouched(); // Mark form controls as touched to show validation errors
    }
  }
}
