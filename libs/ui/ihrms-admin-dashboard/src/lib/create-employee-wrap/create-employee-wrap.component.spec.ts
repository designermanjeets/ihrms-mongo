import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEmployeeWrapComponent } from './create-employee-wrap.component';

describe('CreateEmployeeWrapComponent', () => {
  let component: CreateEmployeeWrapComponent;
  let fixture: ComponentFixture<CreateEmployeeWrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEmployeeWrapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEmployeeWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
