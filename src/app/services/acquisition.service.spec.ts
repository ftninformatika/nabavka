import { TestBed } from '@angular/core/testing';

import { AcquisitionService } from './acquisition.service';

describe('AcquisitionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AcquisitionService = TestBed.get(AcquisitionService);
    expect(service).toBeTruthy();
  });
});
