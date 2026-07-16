import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router, private cartService: CartService) {
    console.log('Auth component initialized');
  }

  goToRegister() {
    console.log('goToRegister called');
    this.router.navigate(['/register']).then(() => {
      console.log('Navigation to register successful');
    }).catch(err => {
      console.error('Navigation error:', err);
    });
  }

  onSubmit() {
    console.log('Login form submitted');
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.isLoading = true;
    console.log('Sending login credentials to API...');

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoading = false;
        this.email = '';
        this.password = '';
        this.cartService.refreshCount();
        
        // Redirect to admin page if user has admin role
        const redirectPath = response.user?.role === 'admin' ? '/admin' : '/home';
        this.router.navigate([redirectPath]).then(() => {
          console.log('Navigation successful');
        }).catch(err => {
          console.error('Navigation failed:', err);
        });
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = error.error?.message || 'Invalid email or password. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
