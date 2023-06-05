import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyEpfComponent } from './company-epf.component';

describe('CompanyEpfComponent', () => {
  let component: CompanyEpfComponent;
  let fixture: ComponentFixture<CompanyEpfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyEpfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyEpfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
