import { TestBed } from '@angular/core/testing';

import { IhrmsGridService } from './ihrms-grid.service';

describe('IhrmsGridService', () => {
  let service: IhrmsGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IhrmsGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
