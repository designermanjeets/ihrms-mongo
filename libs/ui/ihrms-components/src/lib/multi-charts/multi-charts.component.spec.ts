import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiChartsComponent } from './multi-charts.component';

describe('MultiChartsComponent', () => {
  let component: MultiChartsComponent;
  let fixture: ComponentFixture<MultiChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiChartsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
