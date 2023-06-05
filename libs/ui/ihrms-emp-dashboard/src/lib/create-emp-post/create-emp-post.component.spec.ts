import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEmpPostComponent } from './create-emp-post.component';

describe('CreateEmpPostComponent', () => {
  let component: CreateEmpPostComponent;
  let fixture: ComponentFixture<CreateEmpPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateEmpPostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEmpPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
