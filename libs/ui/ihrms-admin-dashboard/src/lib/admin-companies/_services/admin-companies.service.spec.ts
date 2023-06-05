import { TestBed } from '@angular/core/testing';

import { AdminCompaniesService } from './admin-companies.service';

describe('AdminCompaniesService', () => {
  let service: AdminCompaniesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminCompaniesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
