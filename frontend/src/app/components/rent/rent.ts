import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-rent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rent.html',
  styleUrl: './rent.css',
})
export class Rent implements OnInit, OnDestroy {
  products: Product[] = [];
  isLoading = true;
  errorMessage = '';
  selectedQuantities: Record<number, number> = {};
  addingProductIds = new Set<number>();
  feedback: { productId: number; message: string; type: 'success' | 'error' } | null = null;
  private feedbackTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: products => {
        this.products = products.filter(product => product.isRent);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load rentable pieces.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.feedbackTimer) clearTimeout(this.feedbackTimer);
  }

  quantityFor(product: Product): number {
    return this.selectedQuantities[product.Id] ?? 1;
  }

  changeQuantity(product: Product, change: number): void {
    const next = Math.min(product.quantity, Math.max(1, this.quantityFor(product) + change));
    this.selectedQuantities[product.Id] = next;
  }

  addToCart(product: Product): void {
    if (product.quantity === 0 || this.addingProductIds.has(product.Id)) return;
    const quantity = this.quantityFor(product);
    this.addingProductIds.add(product.Id);

    this.cartService.addToCart({
      productId: product.Id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity,
      designer: product.designer,
      isRent: true
    }).subscribe({
      next: () => {
        this.addingProductIds.delete(product.Id);
        this.showFeedback(product.Id, `${quantity} × ${product.name} added to cart`, 'success');
        this.cdr.detectChanges();
      },
      error: err => {
        this.addingProductIds.delete(product.Id);
        this.showFeedback(product.Id, err.error?.message || 'Failed to add rental to cart', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  private showFeedback(productId: number, message: string, type: 'success' | 'error'): void {
    if (this.feedbackTimer) clearTimeout(this.feedbackTimer);
    this.feedback = { productId, message, type };
    this.feedbackTimer = setTimeout(() => {
      this.feedback = null;
      this.cdr.detectChanges();
    }, 3500);
  }
}
