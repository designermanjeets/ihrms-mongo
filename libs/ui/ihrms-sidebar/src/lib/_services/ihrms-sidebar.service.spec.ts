import { TestBed } from '@angular/core/testing';

import { IhrmsSidebarService } from './ihrms-sidebar.service';

describe('IhrmsSidebarService', () => {
  let service: IhrmsSidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IhrmsSidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
