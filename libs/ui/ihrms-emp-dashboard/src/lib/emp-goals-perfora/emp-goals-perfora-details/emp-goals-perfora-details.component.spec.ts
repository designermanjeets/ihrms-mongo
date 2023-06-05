import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpGoalsPerforaDetailsComponent } from './emp-goals-perfora-details.component';

describe('EmpGoalsPerforaDetailsComponent', () => {
  let component: EmpGoalsPerforaDetailsComponent;
  let fixture: ComponentFixture<EmpGoalsPerforaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmpGoalsPerforaDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpGoalsPerforaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
