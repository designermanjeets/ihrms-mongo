import { TestBed } from '@angular/core/testing';

import { AdminAdvReportingService } from './admin-adv-reporting.service';

describe('AdminAdvReportingService', () => {
  let service: AdminAdvReportingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminAdvReportingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
