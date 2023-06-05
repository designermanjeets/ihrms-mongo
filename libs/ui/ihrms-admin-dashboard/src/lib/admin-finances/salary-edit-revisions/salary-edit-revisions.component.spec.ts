import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryEditComponentRevisions } from './salary-edit-revisions.component';

describe('SalaryEditComponent', () => {
  let component: SalaryEditComponentRevisions;
  let fixture: ComponentFixture<SalaryEditComponentRevisions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalaryEditComponentRevisions],
    }).compileComponents();

    fixture = TestBed.createComponent(SalaryEditComponentRevisions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
