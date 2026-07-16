import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: number = 0;
  isLoading = false;
  errorMessage = '';

  categories: {id: number, name: string}[] = [
    {id: 0,  name: 'All'},
    {id: 1,  name: 'Dresses'},
    {id: 4,  name: 'Blouses'},
    {id: 10, name: 'Skirts'},
    {id: 5,  name: 'Pants'},
    {id: 6,  name: 'Shoes'},
    {id: 7,  name: 'Bags'},
    {id: 8,  name: 'Jewellery'},
    {id: 9,  name: 'Headscarf'},
    {id: 2,  name: 'Wedding'},
    {id: 3,  name: 'Engagement'}
  ];

constructor(
  private productService: ProductService,
  private cartService: CartService,
  private route: ActivatedRoute,
  private router: Router,      
  private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.loadProducts();
  }

loadProducts(): void {
  this.isLoading = true;
  this.productService.getProducts().subscribe({
    next: (data) => {
      this.products = data;
      this.isLoading = false;

      // Read category from URL immediately when data arrives
      const categoryId = this.route.snapshot.queryParams['category'];
      if (categoryId) {
        this.filterByCategory(parseInt(categoryId));
      } else {
        this.filteredProducts = [...data];
      }

      this.cdr.detectChanges();
    },
    error: (err) => {
      this.errorMessage = 'Failed to load products';
      this.isLoading = false;
      this.cdr.detectChanges();
      console.error('Error loading products:', err);
    }
  });
}

  getCategoryName(catId: number): string {
    const category = this.categories.find(c => c.id === catId);
    return category ? category.name : 'Unknown';
  }

  filterByCategory(categoryId: number) {
    this.selectedCategory = categoryId;
    if (categoryId === 0) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(p => p.catId === categoryId);
    }
  }

  sortProducts(event: Event) {
    const sortValue = (event.target as HTMLSelectElement).value;
    switch (sortValue) {
      case 'price-low':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        this.filteredProducts.sort((a, b) => b.Id - a.Id);
        break;
      default:
        this.filterByCategory(this.selectedCategory);
    }
  }

  quickView(product: Product) {
    console.log('Quick view:', product.name);
  }

  addToCart(product: Product) {
  if (product.quantity === 0) return;
  this.cartService.addToCart({
    productId: product.Id,
    name:      product.name,
    price:     product.price,
    imageUrl:  product.imageUrl,
    quantity:  1,
    designer:  product.designer,
    isrent:    product.isrent
  }).subscribe({
    next: () => alert(`"${product.name}" added to cart!`),
    error: () => alert('Failed to add to cart')
  });
}
}