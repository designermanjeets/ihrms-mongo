import { TestBed } from '@angular/core/testing';

import { OtherMastersService } from './other-masters.service';

describe('OtherMastersService', () => {
  let service: OtherMastersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtherMastersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
