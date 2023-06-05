import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IhrmsGridsterComponent } from './ihrms-gridster.component';

describe('IhrmsGridsterComponent', () => {
  let component: IhrmsGridsterComponent;
  let fixture: ComponentFixture<IhrmsGridsterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IhrmsGridsterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IhrmsGridsterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
