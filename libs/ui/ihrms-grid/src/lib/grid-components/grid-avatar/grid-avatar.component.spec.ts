import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridAvatarComponent } from './grid-avatar.component';

describe('GridAvatarComponent', () => {
  let component: GridAvatarComponent;
  let fixture: ComponentFixture<GridAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridAvatarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
