import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributersListComponent } from './distributers-list.component';

describe('DistributersListComponent', () => {
  let component: DistributersListComponent;
  let fixture: ComponentFixture<DistributersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributersListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
