import { TestBed } from '@angular/core/testing';

import { EmpGoalsPerformaService } from './emp-goals-performa.service';

describe('EmpGoalsPerformaService', () => {
  let service: EmpGoalsPerformaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpGoalsPerformaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
