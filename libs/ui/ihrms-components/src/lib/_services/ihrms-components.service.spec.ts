import { TestBed } from '@angular/core/testing';

import { IhrmsComponentsService } from './ihrms-components.service';

describe('IhrmsComponentsService', () => {
  let service: IhrmsComponentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IhrmsComponentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
