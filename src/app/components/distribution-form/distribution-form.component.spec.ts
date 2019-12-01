import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionFormComponent } from './distribution-form.component';

describe('DistributionFormComponent', () => {
  let component: DistributionFormComponent;
  let fixture: ComponentFixture<DistributionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
