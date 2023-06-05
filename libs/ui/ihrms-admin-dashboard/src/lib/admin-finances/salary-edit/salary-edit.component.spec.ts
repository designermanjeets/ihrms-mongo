import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryEditComponent } from './salary-edit.component';

describe('SalaryEditComponent', () => {
  let component: SalaryEditComponent;
  let fixture: ComponentFixture<SalaryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalaryEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SalaryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
