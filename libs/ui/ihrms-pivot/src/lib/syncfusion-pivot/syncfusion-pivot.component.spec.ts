import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncfusionPivotComponent } from './syncfusion-pivot.component';

describe('SyncfusionPivotComponent', () => {
  let component: SyncfusionPivotComponent;
  let fixture: ComponentFixture<SyncfusionPivotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SyncfusionPivotComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SyncfusionPivotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
