import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDesignationsComponent } from './admin-designations.component';

describe('AdminDesignationsComponent', () => {
  let component: AdminDesignationsComponent;
  let fixture: ComponentFixture<AdminDesignationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDesignationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDesignationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
