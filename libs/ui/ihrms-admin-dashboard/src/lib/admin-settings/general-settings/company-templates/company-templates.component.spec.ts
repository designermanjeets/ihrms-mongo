import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTemplatesComponent } from './company-templates.component';

describe('CompanyTemplatesComponent', () => {
  let component: CompanyTemplatesComponent;
  let fixture: ComponentFixture<CompanyTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyTemplatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
