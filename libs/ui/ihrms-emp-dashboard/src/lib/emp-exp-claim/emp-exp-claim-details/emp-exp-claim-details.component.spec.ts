import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpExpClaimDetailsComponent } from './emp-exp-claim-details.component';

describe('EmpExpClaimDetailsComponent', () => {
  let component: EmpExpClaimDetailsComponent;
  let fixture: ComponentFixture<EmpExpClaimDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpExpClaimDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpExpClaimDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
