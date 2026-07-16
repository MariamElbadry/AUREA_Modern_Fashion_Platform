import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Designers } from './designers';

describe('Designers', () => {
  let component: Designers;
  let fixture: ComponentFixture<Designers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Designers],
    }).compileComponents();

    fixture = TestBed.createComponent(Designers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
