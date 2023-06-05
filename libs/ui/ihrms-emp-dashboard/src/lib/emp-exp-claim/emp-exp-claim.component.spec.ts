import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpExpClaimComponent } from './emp-exp-claim.component';

describe('EmpExpClaimComponent', () => {
  let component: EmpExpClaimComponent;
  let fixture: ComponentFixture<EmpExpClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpExpClaimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpExpClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
