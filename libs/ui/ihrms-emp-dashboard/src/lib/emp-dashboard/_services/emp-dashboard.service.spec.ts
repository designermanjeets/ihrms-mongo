import { TestBed } from '@angular/core/testing';

import { EmpDashboardService } from './emp-dashboard.service';

describe('EmpDashboardService', () => {
  let service: EmpDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
