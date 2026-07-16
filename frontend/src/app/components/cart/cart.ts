import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  cart: any = { items: [] };
  isLoading = false;
  isPlacingOrder = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void { this.loadCart(); }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (data) => { this.cart = data; this.isLoading = false; this.cdr.detectChanges(); },
      error: () => { this.isLoading = false; this.cdr.detectChanges(); }
    });
  }

  get total(): number {
    return this.cart.items?.reduce((s: number, i: any) => s + i.price * i.quantity, 0) || 0;
  }

  get itemCount(): number {
    return this.cart.items?.reduce((s: number, i: any) => s + i.quantity, 0) || 0;
  }

  increase(item: any): void {
    this.cartService.updateQuantity(item.productId, item.quantity + 1, item.isRent).subscribe({
      next: (cart) => { this.cart = cart; this.cdr.detectChanges(); }
    });
  }

  decrease(item: any): void {
    if (item.quantity <= 1) { this.remove(item); return; }
    this.cartService.updateQuantity(item.productId, item.quantity - 1, item.isRent).subscribe({
      next: (cart) => { this.cart = cart; this.cdr.detectChanges(); }
    });
  }

  remove(item: any): void {
    this.cartService.removeItem(item.productId, item.isRent).subscribe({
      next: (cart) => { this.cart = cart; this.cdr.detectChanges(); }
    });
  }

  clear(): void {
    this.cartService.clearCart().subscribe({
      next: () => { this.cart = { items: [] }; this.cdr.detectChanges(); }
    });
  }

  placeOrder(): void {
    this.isPlacingOrder = true;
    this.orderService.placeOrder().subscribe({
      next: () => {
        this.cart = { items: [] };
        this.isPlacingOrder = false;
        this.successMessage = 'Order placed successfully!';
        this.cartService.resetCount();
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/orders']), 1500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to place order';
        this.isPlacingOrder = false;
        this.cdr.detectChanges();
      }
    });
  }

  continueShopping(): void { this.router.navigate(['/shop']); }
}
