import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IhrmsNavbarComponent } from './ihrms-navbar.component';

describe('IhrmsNavbarComponent', () => {
  let component: IhrmsNavbarComponent;
  let fixture: ComponentFixture<IhrmsNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IhrmsNavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IhrmsNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
