import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyEsiComponent } from './company-esi.component';

describe('CompanyEsiComponent', () => {
  let component: CompanyEsiComponent;
  let fixture: ComponentFixture<CompanyEsiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyEsiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyEsiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
