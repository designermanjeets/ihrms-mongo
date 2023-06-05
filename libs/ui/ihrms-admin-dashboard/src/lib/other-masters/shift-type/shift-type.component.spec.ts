import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftTypeComponent } from './shift-type.component';

describe('ShiftTypeComponent', () => {
  let component: ShiftTypeComponent;
  let fixture: ComponentFixture<ShiftTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
