import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  activePage = 'home';
  isScrolled = false;
  mobileMenuOpen = false;
  accountMenuOpen = false;
  isLoggedIn = false;
  accountName = 'Account';
  fullName = '—';
  role = 'Shopper';
  isDesigner = false;
  cartCount = 0;

  private userSub!: Subscription;
  private cartSub!: Subscription;

  @HostListener('window:scroll', [])
  onWindowScroll() { this.isScrolled = window.scrollY > 20; }

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activePage = event.urlAfterRedirects.replace('/', '').split('?')[0] || 'home';
      }
    });
  }

  ngOnInit(): void {
    this.userSub = this.authService.currentUser$.subscribe({
      next: (user) => {
        if (user) {
          this.isLoggedIn = true;
          this.accountName = user.firstName || 'Account';
          this.fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || '—';
          this.role = user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'Shopper';
          this.isDesigner = user.role === 'designer';
        } else {
          this.isLoggedIn = false;
          this.accountName = 'Account';
          this.fullName = '—';
          this.role = 'Shopper';
          this.isDesigner = false;
          this.cartCount = 0;
        }
      }
    });
    this.cartSub = this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.cartSub?.unsubscribe();
  }

  navigate(page: string): void { this.mobileMenuOpen = false; this.router.navigate([page]); }
  toggleMobileMenu(): void { this.mobileMenuOpen = !this.mobileMenuOpen; }
  toggleAccountMenu(): void { this.accountMenuOpen = !this.accountMenuOpen; }
  openAuth(): void { this.router.navigate(['auth']); }
  goToCart(): void { this.router.navigate(['cart']); }
  goToOrders(): void { this.accountMenuOpen = false; this.router.navigate(['orders']); }
  signOut(): void {
    this.authService.logout();
    this.accountMenuOpen = false;
    this.router.navigate(['auth']);
  }
}