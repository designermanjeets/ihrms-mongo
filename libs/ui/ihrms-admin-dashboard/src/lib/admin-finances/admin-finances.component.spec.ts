import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFinancesComponent } from './admin-finances.component';

describe('AdminFinancesComponent', () => {
  let component: AdminFinancesComponent;
  let fixture: ComponentFixture<AdminFinancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminFinancesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFinancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
