import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePrivilegesSettingsComponent } from './role-privileges-settings.component';

describe('RolePrivilegesSettingsComponent', () => {
  let component: RolePrivilegesSettingsComponent;
  let fixture: ComponentFixture<RolePrivilegesSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolePrivilegesSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolePrivilegesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
