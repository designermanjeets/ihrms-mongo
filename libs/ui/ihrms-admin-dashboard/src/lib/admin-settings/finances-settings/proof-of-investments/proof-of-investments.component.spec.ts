import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProofOfInvestmentsComponent } from './proof-of-investments.component';

describe('ProofOfInvestmentsComponent', () => {
  let component: ProofOfInvestmentsComponent;
  let fixture: ComponentFixture<ProofOfInvestmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProofOfInvestmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProofOfInvestmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
