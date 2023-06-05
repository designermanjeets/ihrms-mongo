import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancesSettingsComponent } from './finances-settings.component';

describe('FinancesSettingsComponent', () => {
  let component: FinancesSettingsComponent;
  let fixture: ComponentFixture<FinancesSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancesSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
