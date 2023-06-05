import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminJobsDashboardComponent } from './admin-jobs-dashboard.component';

describe('AdminJobsDashboardComponent', () => {
  let component: AdminJobsDashboardComponent;
  let fixture: ComponentFixture<AdminJobsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminJobsDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminJobsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
