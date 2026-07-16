import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StyleStudio } from './style-studio';
import { provideRouter } from '@angular/router';

describe('StyleStudio', () => {
  let component: StyleStudio;
  let fixture: ComponentFixture<StyleStudio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StyleStudio],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(StyleStudio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
