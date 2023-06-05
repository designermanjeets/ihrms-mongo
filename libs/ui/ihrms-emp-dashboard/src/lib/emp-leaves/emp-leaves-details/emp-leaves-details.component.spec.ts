import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpLeavesDetailsComponent } from './emp-leaves-details.component';

describe('EmpLeavesDetailsComponent', () => {
  let component: EmpLeavesDetailsComponent;
  let fixture: ComponentFixture<EmpLeavesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpLeavesDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpLeavesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
