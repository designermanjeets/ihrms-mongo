import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHolidaysComponent } from './admin-holidays.component';

describe('AdminHolidaysComponent', () => {
  let component: AdminHolidaysComponent;
  let fixture: ComponentFixture<AdminHolidaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminHolidaysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminHolidaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
