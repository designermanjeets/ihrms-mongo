import { TestBed } from '@angular/core/testing';

import { AdminLeavesService } from './admin-leaves.service';

describe('AdminLeavesService', () => {
  let service: AdminLeavesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminLeavesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
