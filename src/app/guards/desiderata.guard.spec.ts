import { TestBed, inject } from '@angular/core/testing';

import { DesiderataGuard } from './desiderata.guard';

describe('DesiderataGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DesiderataGuard]
    });
  });

  it('should ...', inject([DesiderataGuard], (guard: DesiderataGuard) => {
    expect(guard).toBeTruthy();
  }));
});
