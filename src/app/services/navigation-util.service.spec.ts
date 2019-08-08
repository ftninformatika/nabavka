import { TestBed } from '@angular/core/testing';

import { NavigationUtilService } from './navigation-util.service';

describe('NavigationUtilService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavigationUtilService = TestBed.get(NavigationUtilService);
    expect(service).toBeTruthy();
  });
});
