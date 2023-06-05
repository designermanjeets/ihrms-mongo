import { TestBed } from '@angular/core/testing';

import { SalarySettingsService } from './salary-settings.service';

describe('SalarySettingsService', () => {
  let service: SalarySettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalarySettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
