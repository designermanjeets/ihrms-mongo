import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IhrmsDialogComponent } from './ihrms-dialog.component';

describe('IhrmsDialogComponent', () => {
  let component: IhrmsDialogComponent;
  let fixture: ComponentFixture<IhrmsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IhrmsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IhrmsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
