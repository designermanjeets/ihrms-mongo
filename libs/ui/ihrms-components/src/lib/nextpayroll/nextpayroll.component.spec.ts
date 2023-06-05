import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextpayrollComponent } from './nextpayroll.component';

describe('NextpayrollComponent', () => {
  let component: NextpayrollComponent;
  let fixture: ComponentFixture<NextpayrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NextpayrollComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NextpayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
