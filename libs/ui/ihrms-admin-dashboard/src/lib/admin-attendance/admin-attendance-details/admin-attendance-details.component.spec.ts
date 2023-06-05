import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAttendanceDetailsComponent } from './admin-attendance-details.component';

describe('AdminAttendanceDetailsComponent', () => {
  let component: AdminAttendanceDetailsComponent;
  let fixture: ComponentFixture<AdminAttendanceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAttendanceDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAttendanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
