import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminActivityLogsComponent } from './admin-activity-logs.component';

describe('AdminActivityLogsComponent', () => {
  let component: AdminActivityLogsComponent;
  let fixture: ComponentFixture<AdminActivityLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminActivityLogsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminActivityLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
