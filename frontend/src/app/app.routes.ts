import { Routes } from '@angular/router';
import { Home }      from './components/home/home';
import { Auth }      from './components/auth/auth';
import { Register }  from './components/register/register';
import { Shop }      from './components/shop/shop';
import { New }       from './components/new/new';
import { Products }  from './components/products/products';
import { Designers } from './components/designers/designers';
import { Cart }      from './components/cart/cart';
import { Orders }    from './components/orders/orders';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '',          redirectTo: '/home', pathMatch: 'full' },
  { path: 'home',      component: Home,      canActivate: [authGuard] },
  { path: 'shop',      component: Shop,      canActivate: [authGuard] },
  { path: 'new',       component: New,       canActivate: [authGuard] },
  { path: 'products',  component: Products,  canActivate: [authGuard] },
  { path: 'designers', component: Designers, canActivate: [authGuard] },
  { path: 'cart',      component: Cart,      canActivate: [authGuard] },
  { path: 'orders',    component: Orders,    canActivate: [authGuard] },
  { path: 'auth',      component: Auth },
  { path: 'register',  component: Register },
  { path: '**',        redirectTo: '/home' }
];