import { TestBed } from '@angular/core/testing';

import { EmpExpClaimService } from './emp-exp-claim.service';

describe('EmpExpClaimService', () => {
  let service: EmpExpClaimService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpExpClaimService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
