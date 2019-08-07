import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributorsListComponent } from './distributors-list.component';

describe('DistributorsListComponent', () => {
  let component: DistributorsListComponent;
  let fixture: ComponentFixture<DistributorsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributorsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
