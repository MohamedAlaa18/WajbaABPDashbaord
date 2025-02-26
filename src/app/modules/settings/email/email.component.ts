import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SendingEmailService } from '@proxy/controllers';
import { SettingsSidebarComponent } from '../settings-sidebar/settings-sidebar.component';
import { CreateSiteDto } from '@proxy/dtos/sites-contact';
import { CreateUpdateSendingEmailDto } from '@proxy/dtos/email-contract';

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
    private sendingEmailService: SendingEmailService,
  ) {
    this.siteForm = this.fb.group({
      host: ['', Validators.required],
      port: ['', [Validators.required, Validators.min(1)]],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mailEncryption: ['ssl', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadEmail();
  }

  loadEmail(): void {
    this.sendingEmailService.getFirst().subscribe(
      (response) => {
        this.siteForm.patchValue({
          host: response.data.host,
          port: response.data.port,
          userName: response.data.userName,
          password: response.data.password,
          name: response.data.name,
          email: response.data.email,
          mailEncryption: response.data.mailEncryption || 'ssl',
        });
      },
      (error) => {
        console.error('Error fetching settings:', error);
      }
    );
  }

  submitForm() {
    if (this.siteForm.valid) {
      const formValue = this.siteForm.value as CreateUpdateSendingEmailDto;
      formValue.port = String(this.siteForm.get('port')?.value);

      this.sendingEmailService.update(formValue as CreateUpdateSendingEmailDto).subscribe({
        next: (response) => {
          console.log('Update successful!', response);
        },
        error: (error) => {
          console.error('Update error:', error);
        }
      });
    } else {
      this.siteForm.markAllAsTouched();
    }
  }
}
