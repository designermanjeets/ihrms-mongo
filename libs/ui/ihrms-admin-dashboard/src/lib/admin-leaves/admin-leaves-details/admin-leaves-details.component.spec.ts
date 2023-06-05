import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLeavesDetailsComponent } from './admin-leaves-details.component';

describe('AdminLeavesDetailsComponent', () => {
  let component: AdminLeavesDetailsComponent;
  let fixture: ComponentFixture<AdminLeavesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminLeavesDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLeavesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
