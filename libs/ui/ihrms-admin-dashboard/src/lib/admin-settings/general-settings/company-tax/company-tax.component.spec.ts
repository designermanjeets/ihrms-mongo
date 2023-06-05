import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTaxComponent } from './company-tax.component';

describe('CompanyTaxComponent', () => {
  let component: CompanyTaxComponent;
  let fixture: ComponentFixture<CompanyTaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyTaxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
