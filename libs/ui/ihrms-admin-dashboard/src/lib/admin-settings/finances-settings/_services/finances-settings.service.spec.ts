import { TestBed } from '@angular/core/testing';

import { FinancesSettingsService } from './finances-settings.service';

describe('FinancesSettingsService', () => {
  let service: FinancesSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancesSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
