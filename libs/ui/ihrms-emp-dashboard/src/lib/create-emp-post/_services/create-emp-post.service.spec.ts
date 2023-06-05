import { TestBed } from '@angular/core/testing';

import { CreateEmpPostService } from './create-emp-post.service';

describe('CreateEmpPostService', () => {
  let service: CreateEmpPostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateEmpPostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
