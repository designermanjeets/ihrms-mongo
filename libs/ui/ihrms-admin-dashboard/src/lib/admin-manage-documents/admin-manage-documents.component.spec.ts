import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageDocumentsComponent } from './admin-manage-documents.component';

describe('AdminManageDocumentsComponent', () => {
  let component: AdminManageDocumentsComponent;
  let fixture: ComponentFixture<AdminManageDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminManageDocumentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminManageDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
