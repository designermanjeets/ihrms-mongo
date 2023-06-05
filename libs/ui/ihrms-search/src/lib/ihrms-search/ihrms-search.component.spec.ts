import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IhrmsSearchComponent } from './ihrms-search.component';

describe('IhrmsSearchComponent', () => {
  let component: IhrmsSearchComponent;
  let fixture: ComponentFixture<IhrmsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IhrmsSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IhrmsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
