import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAdminPostComponent } from './create-admin-post.component';

describe('CreateAdminPostComponent', () => {
  let component: CreateAdminPostComponent;
  let fixture: ComponentFixture<CreateAdminPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAdminPostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAdminPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
