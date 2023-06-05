import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IhrmsGridComponent } from './ihrms-grid.component';

describe('IhrmsGridComponent', () => {
  let component: IhrmsGridComponent;
  let fixture: ComponentFixture<IhrmsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IhrmsGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IhrmsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
