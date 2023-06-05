import { TestBed } from '@angular/core/testing';

import { AdminDutyRosterService } from './admin-duty-roster.service';

describe('AdminDutyRosterService', () => {
  let service: AdminDutyRosterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminDutyRosterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
