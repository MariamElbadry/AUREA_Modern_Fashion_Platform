import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { finalize, timeout } from 'rxjs';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
  ) {}

  goToRegister() {
    this.router.navigate(['/register']);
  }

  onSubmit() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.isLoading = true;

    this.authService.login({ email: this.email.trim(), password: this.password }).pipe(
      timeout(15000),
      finalize(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }),
    ).subscribe({
      next: (response) => {
        this.email = '';
        this.password = '';
        this.cartService.refreshCount();
        
        // Redirect to admin page if user has admin role
        const redirectPath = response.user?.role === 'admin' ? '/admin' : '/home';
        this.router.navigate([redirectPath]);
      },
      error: (error) => {
        if (error?.name === 'TimeoutError') {
          this.errorMessage = 'The server took too long to respond. Please try again.';
          return;
        }

        this.errorMessage = typeof error?.error === 'string'
          ? error.error
          : error?.error?.message || 'Invalid email or password. Please try again.';
      }
    });
  }
}
