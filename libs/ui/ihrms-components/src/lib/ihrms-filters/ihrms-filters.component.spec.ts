import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IhrmsFiltersComponent } from './ihrms-filters.component';

describe('IhrmsFiltersComponent', () => {
  let component: IhrmsFiltersComponent;
  let fixture: ComponentFixture<IhrmsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IhrmsFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IhrmsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
