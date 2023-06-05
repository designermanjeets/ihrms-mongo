import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqCorrectionComponent } from './req-correction.component';

describe('ReqCorrectionComponent', () => {
  let component: ReqCorrectionComponent;
  let fixture: ComponentFixture<ReqCorrectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReqCorrectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqCorrectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
