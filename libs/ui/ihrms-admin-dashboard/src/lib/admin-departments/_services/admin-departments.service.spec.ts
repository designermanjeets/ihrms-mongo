import { TestBed } from '@angular/core/testing';

import { AdminDepartmentsService } from './admin-departments.service';

describe('AdminDepartmentsService', () => {
  let service: AdminDepartmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminDepartmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
