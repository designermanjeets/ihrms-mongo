import { TestBed } from '@angular/core/testing';

import { AdminJobsService } from './admin-jobs.service';

describe('AdminJobsService', () => {
  let service: AdminJobsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminJobsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
