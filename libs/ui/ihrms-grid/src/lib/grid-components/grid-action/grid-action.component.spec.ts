import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridActionComponent } from './grid-action.component';

describe('GridActionComponent', () => {
  let component: GridActionComponent;
  let fixture: ComponentFixture<GridActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
