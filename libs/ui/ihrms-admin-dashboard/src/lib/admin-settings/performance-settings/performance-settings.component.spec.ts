import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceSettingsComponent } from './performance-settings.component';

describe('PerformanceSettingsComponent', () => {
  let component: PerformanceSettingsComponent;
  let fixture: ComponentFixture<PerformanceSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformanceSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
