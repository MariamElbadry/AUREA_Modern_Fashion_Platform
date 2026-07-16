import { Component } from '@angular/core';
import { category } from '../../models/category'
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop {
  categories : category[] 
  constructor(private router: Router){
    this.categories = [
      {Id: 1, name: 'Dresses', description: 'Silhouettes that move',imageUrl: 'https://i.pinimg.com/736x/db/78/d0/db78d056d994e1112a266f07396e84fb.jpg'},
      {Id: 4, name: 'Blouses',description: 'Everyday softness',imageUrl: 'https://i.pinimg.com/1200x/99/12/22/991222ca391c945718feab5ffa47f359.jpg'},
      {Id: 10, name: 'Skirts',description: 'Everyday softness',imageUrl: 'https://i.pinimg.com/736x/db/f0/03/dbf0032a87e3e9c65e65205a653d941d.jpg'},
      {Id: 5, name: 'Pants', description: 'Tailoring, refined', imageUrl: 'https://i.pinimg.com/736x/7c/75/eb/7c75eb674e4aae1622ed4ee6f7d47501.jpg'},
      {Id: 6, name: 'Shoes', description: 'Made to walk in', imageUrl: 'https://i.pinimg.com/736x/f1/2a/81/f12a81fe3da50c07d238b59510af29ff.jpg'},
      {Id: 7, name: 'Bags', description: 'The daily companion', imageUrl: 'https://i.pinimg.com/736x/b6/cd/57/b6cd57e0069bd3d1edb03415c6910371.jpg'},
      {Id: 8, name: 'Jewellery', description: 'Gold & warmth', imageUrl: 'https://i.pinimg.com/736x/c9/d6/3a/c9d63a02fe85c4e83fa8f758b615da9d.jpg'},
      {Id: 9, name: 'Headscarf', description: 'Printed silk', imageUrl: 'https://i.pinimg.com/1200x/e7/8a/79/e78a7901d25f2ddac50e97f0106c9bf5.jpg'},
      {Id: 2, name: 'Wedding', description: 'Bridal atelier', imageUrl: 'https://i.pinimg.com/736x/b7/74/7f/b7747f3e68a77b1473c2da8671cd8c2b.jpg'},
      {Id: 3, name: 'Engagement', description: 'The evening before forever', imageUrl: 'https://i.pinimg.com/736x/ac/6e/f2/ac6ef2a7518267f75952fc8aa01accce.jpg'},
    ]
  }


  trackitem(index: number, item: category) {
    return item.Id;
  }

  viewCategory(categoryId: number) {
    this.router.navigate(['/products'], { queryParams: { category: categoryId } });
  }
}
    

