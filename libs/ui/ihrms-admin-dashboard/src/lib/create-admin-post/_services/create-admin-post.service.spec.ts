import { TestBed } from '@angular/core/testing';

import { CreateAdminPostService } from './create-admin-post.service';

describe('CreateAdminPostService', () => {
  let service: CreateAdminPostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateAdminPostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
