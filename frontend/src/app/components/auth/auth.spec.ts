import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Auth } from './auth';
import { provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

class AuthServiceStub {
  response$ = new Subject<any>();

  login() {
    return this.response$.asObservable();
  }
}

class CartServiceStub {
  refreshCount() {}
}

describe('Auth', () => {
  let component: Auth;
  let fixture: ComponentFixture<Auth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Auth],
      providers: [
        provideRouter([]),
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: CartService, useClass: CartServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Auth);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should stop loading and display the API error after a rejected login', () => {
    const authService = TestBed.inject(AuthService) as unknown as AuthServiceStub;
    component.email = 'abdo@gmail.com';
    component.password = 'wrong-password';

    component.onSubmit();
    expect(component.isLoading).toBe(true);

    authService.response$.error({ error: { message: 'Invalid credentials' } });

    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBe('Invalid credentials');
  });
});
