import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdApiValueComponent } from './id-api-value.component';

describe('IdApiValueComponent', () => {
  let component: IdApiValueComponent;
  let fixture: ComponentFixture<IdApiValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdApiValueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdApiValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
