import { TestBed } from '@angular/core/testing';

import { AdminTimesheetsService } from './admin-timesheets.service';

describe('AdminTimesheetsService', () => {
  let service: AdminTimesheetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminTimesheetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
