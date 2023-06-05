import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAdvReportingComponent } from './admin-adv-reporting.component';

describe('AdminAdvReportingComponent', () => {
  let component: AdminAdvReportingComponent;
  let fixture: ComponentFixture<AdminAdvReportingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminAdvReportingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAdvReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
