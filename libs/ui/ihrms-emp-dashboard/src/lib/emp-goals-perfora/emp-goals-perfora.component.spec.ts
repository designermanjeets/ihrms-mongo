import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpGoalsPerforaComponent } from './emp-goals-perfora.component';

describe('EmpGoalsPerforaComponent', () => {
  let component: EmpGoalsPerforaComponent;
  let fixture: ComponentFixture<EmpGoalsPerforaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmpGoalsPerforaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpGoalsPerforaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
