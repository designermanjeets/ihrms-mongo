import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IhrmsListItemsComponent } from './ihrms-list-items.component';

describe('IhrmsListItemsComponent', () => {
  let component: IhrmsListItemsComponent;
  let fixture: ComponentFixture<IhrmsListItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IhrmsListItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IhrmsListItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
