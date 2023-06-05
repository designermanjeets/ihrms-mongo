import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpFinancesComponent } from './emp-finances.component';

describe('EmpFinancesComponent', () => {
  let component: EmpFinancesComponent;
  let fixture: ComponentFixture<EmpFinancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpFinancesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpFinancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
