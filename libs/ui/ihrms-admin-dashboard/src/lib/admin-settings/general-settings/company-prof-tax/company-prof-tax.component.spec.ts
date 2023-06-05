import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyProfTaxComponent } from './company-prof-tax.component';

describe('CompanyProfTaxComponent', () => {
  let component: CompanyProfTaxComponent;
  let fixture: ComponentFixture<CompanyProfTaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyProfTaxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyProfTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
