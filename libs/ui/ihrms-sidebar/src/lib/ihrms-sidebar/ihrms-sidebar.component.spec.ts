import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IhrmsSidebarComponent } from './ihrms-sidebar.component';

describe('IhrmsSidebarComponent', () => {
  let component: IhrmsSidebarComponent;
  let fixture: ComponentFixture<IhrmsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IhrmsSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IhrmsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
