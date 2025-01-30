import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WajbaUserService } from '@proxy/controllers';
import { IconsComponent } from "../../shared/icons/icons.component";
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private wajbaUserService: WajbaUserService,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      logInAPPCode: ['DashBoardweb@SpotIdeas'],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;

      const loginData = this.loginForm.value;

      this.wajbaUserService.logIn(loginData).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.cookieService.set('userToken', response.generateToken.result, loginData.rememberMe ? 30 : 1, '/');

          // Redirect to dashboard or home page
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Login error:', error);
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
