import { TestBed } from '@angular/core/testing';

import { ShiftScheduleService } from './shift-schedule.service';

describe('ShiftScheduleService', () => {
  let service: ShiftScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
