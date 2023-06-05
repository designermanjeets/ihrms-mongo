import { TestBed } from '@angular/core/testing';

import { DynamicFormControlService } from './dynamic-form-control.service';

describe('DynamicFormControlService', () => {
  let service: DynamicFormControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicFormControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
