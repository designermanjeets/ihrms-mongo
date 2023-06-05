import { TestBed } from '@angular/core/testing';

import { OnDutyRequestsService } from './on-duty-requests.service';

describe('OnDutyRequestsService', () => {
  let service: OnDutyRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnDutyRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
