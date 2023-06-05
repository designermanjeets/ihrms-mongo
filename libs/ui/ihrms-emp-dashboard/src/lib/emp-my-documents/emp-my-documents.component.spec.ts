import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpMyDocumentsComponent } from './emp-my-documents.component';

describe('EmpMyDocumentsComponent', () => {
  let component: EmpMyDocumentsComponent;
  let fixture: ComponentFixture<EmpMyDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmpMyDocumentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpMyDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
