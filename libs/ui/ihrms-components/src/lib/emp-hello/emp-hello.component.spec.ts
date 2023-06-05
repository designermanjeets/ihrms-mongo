import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpHelloComponent } from './emp-hello.component';

describe('EmpHelloComponent', () => {
  let component: EmpHelloComponent;
  let fixture: ComponentFixture<EmpHelloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpHelloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpHelloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
