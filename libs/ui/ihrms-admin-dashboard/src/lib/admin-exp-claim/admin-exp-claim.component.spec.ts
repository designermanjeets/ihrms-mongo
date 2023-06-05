import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminExpClaimComponent } from './admin-exp-claim.component';

describe('AdminExpClaimComponent', () => {
  let component: AdminExpClaimComponent;
  let fixture: ComponentFixture<AdminExpClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminExpClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminExpClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
