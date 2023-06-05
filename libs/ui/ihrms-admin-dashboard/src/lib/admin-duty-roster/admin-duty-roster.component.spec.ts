import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDutyRosterComponent } from './admin-duty-roster.component';

describe('AdminDutyRosterComponent', () => {
  let component: AdminDutyRosterComponent;
  let fixture: ComponentFixture<AdminDutyRosterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDutyRosterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDutyRosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
