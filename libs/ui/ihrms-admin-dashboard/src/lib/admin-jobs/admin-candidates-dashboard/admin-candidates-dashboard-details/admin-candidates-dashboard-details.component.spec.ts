import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsersDashboardDetailsComponent } from './admin-users-dashboard-details.component';

describe('AdminUsersDashboardDetailsComponent', () => {
  let component: AdminUsersDashboardDetailsComponent;
  let fixture: ComponentFixture<AdminUsersDashboardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminUsersDashboardDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUsersDashboardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
