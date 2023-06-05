import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminExpClaimDetailsComponent } from './admin-exp-claim-details.component';

describe('AdminExpClaimDetailsComponent', () => {
  let component: AdminExpClaimDetailsComponent;
  let fixture: ComponentFixture<AdminExpClaimDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminExpClaimDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminExpClaimDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
