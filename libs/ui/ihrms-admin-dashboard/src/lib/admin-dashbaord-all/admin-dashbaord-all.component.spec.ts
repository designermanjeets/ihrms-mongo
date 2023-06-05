import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashbaordAllComponent } from './admin-dashbaord-all.component';

describe('AdminDashbaordAllComponent', () => {
  let component: AdminDashbaordAllComponent;
  let fixture: ComponentFixture<AdminDashbaordAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDashbaordAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDashbaordAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
