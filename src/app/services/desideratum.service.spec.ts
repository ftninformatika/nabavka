import { TestBed } from '@angular/core/testing';

import { DesideratumService } from './desideratum.service';

describe('DesideratumService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DesideratumService = TestBed.get(DesideratumService);
    expect(service).toBeTruthy();
  });
});
