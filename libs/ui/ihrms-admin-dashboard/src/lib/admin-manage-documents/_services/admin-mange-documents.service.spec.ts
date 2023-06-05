import { TestBed } from '@angular/core/testing';

import { AdminMangeDocumentsService } from './admin-mange-documents.service';

describe('AdminMangeDocumentsService', () => {
  let service: AdminMangeDocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminMangeDocumentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
