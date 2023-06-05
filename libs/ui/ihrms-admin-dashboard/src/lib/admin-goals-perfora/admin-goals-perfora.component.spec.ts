import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGoalsPerforaComponent } from './admin-goals-perfora.component';

describe('AdminGoalsPerforaComponent', () => {
  let component: AdminGoalsPerforaComponent;
  let fixture: ComponentFixture<AdminGoalsPerforaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminGoalsPerforaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminGoalsPerforaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
