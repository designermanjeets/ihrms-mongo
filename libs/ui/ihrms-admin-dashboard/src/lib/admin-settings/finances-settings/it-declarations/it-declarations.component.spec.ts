import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItDeclarationsComponent } from './it-declarations.component';

describe('ItDeclarationsComponent', () => {
  let component: ItDeclarationsComponent;
  let fixture: ComponentFixture<ItDeclarationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItDeclarationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItDeclarationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
