import { TestBed } from '@angular/core/testing';

import { IhrmsSearchService } from './ihrms-search.service';

describe('IhrmsSearchService', () => {
  let service: IhrmsSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IhrmsSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
