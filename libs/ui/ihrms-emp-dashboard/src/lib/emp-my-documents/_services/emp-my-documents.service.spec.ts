import { TestBed } from '@angular/core/testing';

import { EmpMyDocumentsService } from './emp-my-documents.service';

describe('EmpMyDocumentsService', () => {
  let service: EmpMyDocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpMyDocumentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
