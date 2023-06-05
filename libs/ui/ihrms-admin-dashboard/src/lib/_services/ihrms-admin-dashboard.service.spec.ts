import { TestBed } from '@angular/core/testing';

import { IhrmsAdminDashboardService } from './ihrms-admin-dashboard.service';

describe('IhrmsAdminDashboardService', () => {
  let service: IhrmsAdminDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IhrmsAdminDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
