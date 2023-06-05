import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOrgComponent } from './my-org.component';

describe('MyOrgComponent', () => {
  let component: MyOrgComponent;
  let fixture: ComponentFixture<MyOrgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyOrgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyOrgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
