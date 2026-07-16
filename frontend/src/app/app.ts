import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone : true,
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnDestroy {
  showSiteChrome = true;
  private readonly routerSub: Subscription;

  constructor(private router: Router) {
    this.updateSiteChrome(this.router.url);
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateSiteChrome(event.urlAfterRedirects);
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }

  private updateSiteChrome(url: string): void {
    const route = url.split('?')[0].split('/').filter(Boolean)[0] ?? '';
    this.showSiteChrome = !['auth', 'register', 'admin'].includes(route);
  }
}
