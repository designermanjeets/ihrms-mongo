import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTimesheetsComponent } from './admin-timesheets.component';

describe('AdminTimesheetsComponent', () => {
  let component: AdminTimesheetsComponent;
  let fixture: ComponentFixture<AdminTimesheetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminTimesheetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTimesheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
