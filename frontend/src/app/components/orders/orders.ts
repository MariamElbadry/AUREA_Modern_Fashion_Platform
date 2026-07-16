import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit {
  orders: any[] = [];
  isLoading = false;
  expandedOrderId: string | null = null;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void { this.loadOrders(); }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getOrders().subscribe({
      next: (data) => { this.orders = data; this.isLoading = false; this.cdr.detectChanges(); },
      error: () => { this.isLoading = false; this.cdr.detectChanges(); }
    });
  }

  toggleExpand(orderId: string): void {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  cancelOrder(order: any): void {
    this.orderService.cancelOrder(order._id).subscribe({
      next: (updated) => {
        const idx = this.orders.findIndex(o => o._id === order._id);
        if (idx !== -1) this.orders[idx] = updated;
        this.cdr.detectChanges();
      }
    });
  }

  shopNow(): void { this.router.navigate(['/shop']); }
}