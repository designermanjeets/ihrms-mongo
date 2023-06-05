import { TestBed } from '@angular/core/testing';

import { AdminAttendanceService } from './admin-attendance.service';

describe('AdminAttendanceService', () => {
  let service: AdminAttendanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminAttendanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
