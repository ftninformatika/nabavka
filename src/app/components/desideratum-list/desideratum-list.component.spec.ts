import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesideratumListComponent } from './desideratum-list.component';

describe('DesideratumListComponent', () => {
  let component: DesideratumListComponent;
  let fixture: ComponentFixture<DesideratumListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesideratumListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesideratumListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
