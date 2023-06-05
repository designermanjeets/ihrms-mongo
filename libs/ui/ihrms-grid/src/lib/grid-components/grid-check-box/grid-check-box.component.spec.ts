import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridCheckBoxComponent } from './grid-check-box.component';

describe('GridCheckBoxComponent', () => {
  let component: GridCheckBoxComponent;
  let fixture: ComponentFixture<GridCheckBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridCheckBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridCheckBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
