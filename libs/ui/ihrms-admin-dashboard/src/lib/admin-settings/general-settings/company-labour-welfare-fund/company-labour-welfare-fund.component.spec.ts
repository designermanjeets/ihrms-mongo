import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyLabourWelfareFundComponent } from './company-labour-welfare-fund.component';

describe('CompanyLabourWelfareFundComponent', () => {
  let component: CompanyLabourWelfareFundComponent;
  let fixture: ComponentFixture<CompanyLabourWelfareFundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyLabourWelfareFundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyLabourWelfareFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
