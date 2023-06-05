import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaysInoutComponent } from './todays-inout.component';

describe('TodaysInoutComponent', () => {
  let component: TodaysInoutComponent;
  let fixture: ComponentFixture<TodaysInoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodaysInoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodaysInoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
