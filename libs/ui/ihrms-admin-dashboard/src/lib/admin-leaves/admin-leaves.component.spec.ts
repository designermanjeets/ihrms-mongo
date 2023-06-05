import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLeavesComponent } from './admin-leaves.component';

describe('AdminLeavesComponent', () => {
  let component: AdminLeavesComponent;
  let fixture: ComponentFixture<AdminLeavesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminLeavesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLeavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
