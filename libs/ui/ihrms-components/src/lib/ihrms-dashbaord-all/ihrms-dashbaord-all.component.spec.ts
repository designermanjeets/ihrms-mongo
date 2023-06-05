import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IhrmsDashbaordAllComponent } from './ihrms-dashbaord-all.component';

describe('IhrmsDashbaordAllComponent', () => {
  let component: IhrmsDashbaordAllComponent;
  let fixture: ComponentFixture<IhrmsDashbaordAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IhrmsDashbaordAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IhrmsDashbaordAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
