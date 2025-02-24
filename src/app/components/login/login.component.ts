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
  returnedErrorMessages: string = '';

  constructor(
    private fb: FormBuilder,
    private wajbaUserService: WajbaUserService,
    private router: Router,
    private cookieService: CookieService,
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

          // Save token in cookies
          this.cookieService.set('userToken', response.generateToken.result, loginData.rememberMe ? 30 : 1, '/');

          // Save user data
          const userData = {
            fullName: response.wajbaUser.fullName,
            email: response.wajbaUser.email,
            phone: response.wajbaUser.phone,
            status: response.wajbaUser.status,
            type: response.wajbaUser.type,
            genderType: response.wajbaUser.genderType,
            profilePhoto: response.wajbaUser.profilePhoto,
            id: response.wajbaUser.id,
          };

          if (loginData.rememberMe) {
            localStorage.setItem('userData', JSON.stringify(userData));
          } else {
            sessionStorage.setItem('userData', JSON.stringify(userData));
          }

          // Navigate to '/' and then refresh the page
          this.router.navigate(['/']).then(() => {
            window.location.reload();
          });
        },
        error: (error) => {
          console.error('Login error:', error);
          this.returnedErrorMessages = error.error.message;
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
