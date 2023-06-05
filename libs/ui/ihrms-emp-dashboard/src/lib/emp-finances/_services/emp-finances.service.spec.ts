import { TestBed } from '@angular/core/testing';

import { EmpFinancesService } from './emp-finances.service';

describe('EmpFinancesService', () => {
  let service: EmpFinancesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpFinancesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
