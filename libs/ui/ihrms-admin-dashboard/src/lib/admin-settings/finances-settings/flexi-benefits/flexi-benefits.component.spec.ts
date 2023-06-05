import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexiBenefitsComponent } from './flexi-benefits.component';

describe('FlexiBenefitsComponent', () => {
  let component: FlexiBenefitsComponent;
  let fixture: ComponentFixture<FlexiBenefitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlexiBenefitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlexiBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
