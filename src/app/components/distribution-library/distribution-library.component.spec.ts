import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionLibraryComponent } from './distribution-library.component';

describe('DistributionLibraryComponent', () => {
  let component: DistributionLibraryComponent;
  let fixture: ComponentFixture<DistributionLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributionLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
