import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementClaimsComponent } from './reimbursement-claims.component';

describe('ReimbursementClaimsComponent', () => {
  let component: ReimbursementClaimsComponent;
  let fixture: ComponentFixture<ReimbursementClaimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReimbursementClaimsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReimbursementClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
