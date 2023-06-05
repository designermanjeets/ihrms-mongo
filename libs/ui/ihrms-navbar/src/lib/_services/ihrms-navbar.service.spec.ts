import { TestBed } from '@angular/core/testing';

import { IhrmsNavbarService } from './ihrms-navbar.service';

describe('IhrmsNavbarService', () => {
  let service: IhrmsNavbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IhrmsNavbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
