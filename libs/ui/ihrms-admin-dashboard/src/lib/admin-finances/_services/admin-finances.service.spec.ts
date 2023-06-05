import { TestBed } from '@angular/core/testing';

import { AdminFinancesService } from './admin-finances.service';

describe('AdminFinancesService', () => {
  let service: AdminFinancesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminFinancesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
