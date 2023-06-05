import { TestBed } from '@angular/core/testing';

import { IhrmsEmpDashboardService } from './ihrms-emp-dashboard.service';

describe('IhrmsEmpDashboardService', () => {
  let service: IhrmsEmpDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IhrmsEmpDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
