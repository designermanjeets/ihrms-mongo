import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IhrmsFileManagerComponent } from './ihrms-file-manager.component';

describe('IhrmsFileManagerComponent', () => {
  let component: IhrmsFileManagerComponent;
  let fixture: ComponentFixture<IhrmsFileManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IhrmsFileManagerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IhrmsFileManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
