import { TestBed } from '@angular/core/testing';

import { AdminDesignationsService } from './admin-designations.service';

describe('AdminDesignationsService', () => {
  let service: AdminDesignationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminDesignationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
