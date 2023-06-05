import { TestBed } from '@angular/core/testing';

import { AdminHolidaysService } from './admin-holidays.service';

describe('AdminHolidaysService', () => {
  let service: AdminHolidaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminHolidaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
