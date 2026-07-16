import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { Shop } from './components/shop/shop';
import { Products } from './components/products/products';
import { Home } from './components/home/home'
import { New } from './components/new/new'
import { Auth } from './components/auth/auth'
import { Register } from './components/register/register'
import { Designers } from './components/designers/designers'

@Component({
  selector: 'app-root',
  standalone : true,
  imports: [RouterOutlet, Navbar, Footer, Shop, Products, Home, New, Auth, Register, Designers],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
