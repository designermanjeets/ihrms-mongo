import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridSimpleListComponent } from './grid-simple-list.component';

describe('GridSimpleListComponent', () => {
  let component: GridSimpleListComponent;
  let fixture: ComponentFixture<GridSimpleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridSimpleListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSimpleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
