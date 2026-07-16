import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    termsAccepted: false
  };

  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    console.log('Register component initialized');
  }

  goToAuth() {
    this.router.navigate(['/auth']);
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.formData.firstName || !this.formData.lastName || !this.formData.email || !this.formData.password) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (!this.formData.termsAccepted) {
      this.errorMessage = 'Please accept the terms and conditions.';
      return;
    }

    if (this.formData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }

    this.isLoading = true;

    const userData = {
      firstName: this.formData.firstName,
      lastName: this.formData.lastName,
      email: this.formData.email,
      password: this.formData.password,
      role: this.formData.role
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.successMessage = 'Registration successful! Redirecting...';
        this.isLoading = false;
        this.formData = {
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'customer',
          termsAccepted: false
        };
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1500);
      },
      error: (error) => {
        const message = error.error?.message || '';
        this.isLoading = false;

        if (message === 'User already exists') {
          this.errorMessage = 'An account with this email already exists. Redirecting to sign in...';
          setTimeout(() => {
            this.router.navigate(['/auth']);
          }, 2000);
        } else {
          this.errorMessage = message || 'Registration failed. Please try again.';
        }
      }
    });
  }
}