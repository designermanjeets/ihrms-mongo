import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayFormulaComponent } from './pay-formula.component';

describe('PayFormulaComponent', () => {
  let component: PayFormulaComponent;
  let fixture: ComponentFixture<PayFormulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayFormulaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayFormulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
