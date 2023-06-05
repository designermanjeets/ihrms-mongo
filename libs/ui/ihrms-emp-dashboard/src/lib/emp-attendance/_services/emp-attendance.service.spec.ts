import { TestBed } from '@angular/core/testing';

import { EmpAttendanceService } from './emp-attendance.service';

describe('EmpAttendanceService', () => {
  let service: EmpAttendanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpAttendanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
