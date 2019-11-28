import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionItemComponent } from './distribution-item.component';

describe('DistributionItemComponent', () => {
  let component: DistributionItemComponent;
  let fixture: ComponentFixture<DistributionItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributionItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
