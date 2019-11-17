import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcquisitionItemComponent } from './acquisition-item.component';

describe('AcquisitionItemComponent', () => {
  let component: AcquisitionItemComponent;
  let fixture: ComponentFixture<AcquisitionItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcquisitionItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcquisitionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
