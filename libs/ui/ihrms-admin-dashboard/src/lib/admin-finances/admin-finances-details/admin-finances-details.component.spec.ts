import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFinancesDetailsComponent } from './admin-finances-details.component';

describe('AdminFinancesDetailsComponent', () => {
  let component: AdminFinancesDetailsComponent;
  let fixture: ComponentFixture<AdminFinancesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminFinancesDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFinancesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
