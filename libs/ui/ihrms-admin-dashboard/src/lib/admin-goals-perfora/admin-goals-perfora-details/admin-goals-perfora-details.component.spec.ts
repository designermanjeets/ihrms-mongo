import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGoalsPerforaDetailsComponent } from './admin-goals-perfora-details.component';

describe('AdminGoalsPerforaDetailsComponent', () => {
  let component: AdminGoalsPerforaDetailsComponent;
  let fixture: ComponentFixture<AdminGoalsPerforaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminGoalsPerforaDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminGoalsPerforaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
