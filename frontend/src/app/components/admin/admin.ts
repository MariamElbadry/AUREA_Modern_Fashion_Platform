import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

interface Toast {
  message: string;
  type: 'success' | 'error';
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  currentUser: any;
  activeTab: 'dashboard' | 'products' = 'dashboard';

  // Products state
  products: Product[] = [];
  isLoading = false;
  searchTerm = '';

  // Modal state
  showModal = false;
  isEditing = false;
  isSaving = false;
  deleteConfirmId: number | null = null;
  isDeleting = false;

  // Toast
  toast: Toast | null = null;
  private toastTimer: any;

  // Form data
  form: Partial<Product> & { [key: string]: any } = {
    name: '',
    price: 0,
    catId: 1,
    imageUrl: '',
    quantity: 0,
    designer: '',
    isRent: false,
    isNew: false
  };

  editingId: number | null = null;

  categories = [
    { id: 1,  name: 'Dresses' },
    { id: 2,  name: 'Wedding' },
    { id: 3,  name: 'Engagement' },
    { id: 4,  name: 'Blouses' },
    { id: 5,  name: 'Pants' },
    { id: 6,  name: 'Shoes' },
    { id: 7,  name: 'Bags' },
    { id: 8,  name: 'Jewellery' },
    { id: 9,  name: 'Headscarf' },
    { id: 10, name: 'Skirts' },
  ];

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.showToast('Failed to load products', 'error');
      }
    });
  }

  get filteredProducts(): Product[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.products;
    return this.products.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.designer.toLowerCase().includes(term) ||
      this.getCategoryName(p.catId).toLowerCase().includes(term)
    );
  }

  get totalProducts(): number { return this.products.length; }
  get totalStock(): number { return this.products.reduce((s, p) => s + p.quantity, 0); }
  get rentableCount(): number { return this.products.filter(p => p.isRent).length; }
  get newArrivalsCount(): number { return this.products.filter(p => p.isNew).length; }

  getCategoryName(catId: number): string {
    return this.categories.find(c => c.id === catId)?.name ?? 'Unknown';
  }

  // --- Modal ---
  openAddModal(): void {
    this.isEditing = false;
    this.editingId = null;
    this.form = { name: '', price: 0, catId: 1, imageUrl: '', quantity: 0, designer: '', isRent: false, isNew: false };
    this.showModal = true;
  }

  openEditModal(product: Product): void {
    this.isEditing = true;
    this.editingId = product.Id;
    this.form = {
      name: product.name,
      price: product.price,
      catId: product.catId,
      imageUrl: product.imageUrl,
      quantity: product.quantity,
      designer: product.designer,
      isRent: product.isRent,
      isNew: product.isNew
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.isSaving = false;
  }

  submitForm(): void {
    if (!this.form['name'] || !this.form['imageUrl'] || !this.form['designer']) {
      this.showToast('Please fill in all required fields', 'error');
      return;
    }
    this.isSaving = true;

    if (this.isEditing && this.editingId !== null) {
      this.productService.updateProduct(this.editingId, this.form).subscribe({
        next: (updated) => {
          const idx = this.products.findIndex(p => p.Id === this.editingId);
          if (idx !== -1) this.products[idx] = updated;
          this.closeModal();
          this.showToast(`"${updated.name}" updated successfully`, 'success');
        },
        error: (err) => {
          this.isSaving = false;
          this.showToast(err.error?.message || 'Failed to update product', 'error');
        }
      });
    } else {
      // Auto-assign Id: max existing Id + 1
      const maxId = this.products.length > 0 ? Math.max(...this.products.map(p => p.Id)) : 0;
      const payload = { ...this.form, Id: maxId + 1 };
      this.productService.createProduct(payload).subscribe({
        next: (created) => {
          this.products.unshift(created);
          this.closeModal();
          this.showToast(`"${created.name}" added successfully`, 'success');
        },
        error: (err) => {
          this.isSaving = false;
          this.showToast(err.error?.message || 'Failed to create product', 'error');
        }
      });
    }
  }

  // --- Delete ---
  confirmDelete(id: number): void {
    this.deleteConfirmId = id;
  }

  cancelDelete(): void {
    this.deleteConfirmId = null;
  }

  executeDelete(): void {
    if (this.deleteConfirmId === null) return;
    this.isDeleting = true;
    const id = this.deleteConfirmId;
    const name = this.products.find(p => p.Id === id)?.name ?? 'Product';
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.Id !== id);
        this.deleteConfirmId = null;
        this.isDeleting = false;
        this.showToast(`"${name}" deleted`, 'success');
      },
      error: (err) => {
        this.isDeleting = false;
        this.showToast(err.error?.message || 'Failed to delete product', 'error');
      }
    });
  }

  // --- Toast ---
  showToast(message: string, type: 'success' | 'error'): void {
    clearTimeout(this.toastTimer);
    this.toast = { message, type };
    this.toastTimer = setTimeout(() => this.toast = null, 3500);
  }

  // --- Navigation ---
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
