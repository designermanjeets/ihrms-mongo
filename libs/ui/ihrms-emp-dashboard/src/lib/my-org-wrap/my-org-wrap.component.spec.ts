import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOrgWrapComponent } from './my-org-wrap.component';

describe('MyOrgWrapComponent', () => {
  let component: MyOrgWrapComponent;
  let fixture: ComponentFixture<MyOrgWrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyOrgWrapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOrgWrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
