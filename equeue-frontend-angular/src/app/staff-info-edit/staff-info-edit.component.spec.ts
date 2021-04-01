import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffInfoEditComponent } from './staff-info-edit.component';

describe('StaffInfoEditComponent', () => {
  let component: StaffInfoEditComponent;
  let fixture: ComponentFixture<StaffInfoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffInfoEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffInfoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
