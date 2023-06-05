import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileWrapComponent } from './my-profile-wrap.component';

describe('MyProfileWrapComponent', () => {
  let component: MyProfileWrapComponent;
  let fixture: ComponentFixture<MyProfileWrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyProfileWrapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
