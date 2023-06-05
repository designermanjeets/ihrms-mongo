import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IhrmsChartComponent } from './ihrms-chart.component';

describe('IhrmsChartComponent', () => {
  let component: IhrmsChartComponent;
  let fixture: ComponentFixture<IhrmsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IhrmsChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IhrmsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
