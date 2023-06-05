import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftScheduleComponent } from './shift-schedule.component';

describe('ShiftScheduleComponent', () => {
  let component: ShiftScheduleComponent;
  let fixture: ComponentFixture<ShiftScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
