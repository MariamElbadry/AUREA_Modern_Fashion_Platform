import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignerService } from '../../services/designer.service';

@Component({
  selector: 'app-designers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './designers.html',
  styleUrl: './designers.css',
})
export class Designers implements OnInit {
  designers: any[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private designerService: DesignerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDesigners();
  }

  loadDesigners(): void {
    this.isLoading = true;
    this.designerService.getDesigners().subscribe({
      next: (data) => {
        this.designers = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load designers';
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error('Error loading designers:', err);
      }
    });
  }
}