import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartSearchMemberComponent } from './smart-search-member.component';

describe('SmartSearchMemberComponent', () => {
  let component: SmartSearchMemberComponent;
  let fixture: ComponentFixture<SmartSearchMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmartSearchMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartSearchMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
