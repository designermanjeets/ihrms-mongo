import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpAttendanceDetailsComponent } from './emp-attendance-details.component';

describe('EmpAttendanceDetailsComponent', () => {
  let component: EmpAttendanceDetailsComponent;
  let fixture: ComponentFixture<EmpAttendanceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpAttendanceDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpAttendanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
