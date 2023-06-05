import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridTimezoneComponent } from './grid-timezone.component';

describe('GridTimezoneComponent', () => {
  let component: GridTimezoneComponent;
  let fixture: ComponentFixture<GridTimezoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridTimezoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridTimezoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
