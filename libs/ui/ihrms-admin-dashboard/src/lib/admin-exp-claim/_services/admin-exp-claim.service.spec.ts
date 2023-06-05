import { TestBed } from '@angular/core/testing';

import { AdminExpClaimService } from './admin-exp-claim.service';

describe('AdminExpClaimService', () => {
  let service: AdminExpClaimService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminExpClaimService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
