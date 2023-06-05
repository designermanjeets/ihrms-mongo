import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeOfEmploymentComponent } from './mode-of-employment.component';

describe('ModeOfEmploymentComponent', () => {
  let component: ModeOfEmploymentComponent;
  let fixture: ComponentFixture<ModeOfEmploymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModeOfEmploymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModeOfEmploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
