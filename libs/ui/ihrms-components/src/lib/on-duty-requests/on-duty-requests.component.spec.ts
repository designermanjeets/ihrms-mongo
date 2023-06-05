import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnDutyRequestsComponent } from './on-duty-requests.component';

describe('OnDutyRequestsComponent', () => {
  let component: OnDutyRequestsComponent;
  let fixture: ComponentFixture<OnDutyRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnDutyRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnDutyRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
