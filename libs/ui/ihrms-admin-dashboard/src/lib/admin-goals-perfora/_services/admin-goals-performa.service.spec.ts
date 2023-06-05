import { TestBed } from '@angular/core/testing';

import { AdminGoalsPerformaService } from './admin-goals-performa.service';

describe('AdminGoalsPerformaService', () => {
  let service: AdminGoalsPerformaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminGoalsPerformaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
