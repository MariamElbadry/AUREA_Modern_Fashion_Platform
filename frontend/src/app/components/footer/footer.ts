import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})

export class Footer {
  navigate(page: string): void {
    // TODO: Implement actual navigation logic with Angular Router
    console.log('Navigate to:', page);
  }
}
