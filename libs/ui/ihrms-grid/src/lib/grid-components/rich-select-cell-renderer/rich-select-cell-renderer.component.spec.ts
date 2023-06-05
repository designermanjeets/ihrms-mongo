import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RichSelectCellRendererComponent } from './rich-select-cell-renderer.component';

describe('RichSelectCellRendererComponent', () => {
  let component: RichSelectCellRendererComponent;
  let fixture: ComponentFixture<RichSelectCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RichSelectCellRendererComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RichSelectCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
