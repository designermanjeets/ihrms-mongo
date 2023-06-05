import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpFinancesDetailsComponent } from './emp-finances-details.component';

describe('EmpFinancesDetailsComponent', () => {
  let component: EmpFinancesDetailsComponent;
  let fixture: ComponentFixture<EmpFinancesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpFinancesDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpFinancesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
