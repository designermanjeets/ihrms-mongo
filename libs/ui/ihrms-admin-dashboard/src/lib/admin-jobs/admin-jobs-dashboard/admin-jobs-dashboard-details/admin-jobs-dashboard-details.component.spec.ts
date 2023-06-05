import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminJobsDashboardDetailsComponent } from './admin-jobs-dashboard-details.component';

describe('AdminJobsDashboardDetailsComponent', () => {
  let component: AdminJobsDashboardDetailsComponent;
  let fixture: ComponentFixture<AdminJobsDashboardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminJobsDashboardDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminJobsDashboardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
