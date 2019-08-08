import { TestBed, inject } from '@angular/core/testing';

import { AcquisitionGuard } from './acquisition.guard';

describe('AcquisitionGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AcquisitionGuard]
    });
  });

  it('should ...', inject([AcquisitionGuard], (guard: AcquisitionGuard) => {
    expect(guard).toBeTruthy();
  }));
});
