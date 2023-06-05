import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalarySettingsComponent } from './salary-settings.component';

describe('SalarySettingsComponent', () => {
  let component: SalarySettingsComponent;
  let fixture: ComponentFixture<SalarySettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalarySettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalarySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
