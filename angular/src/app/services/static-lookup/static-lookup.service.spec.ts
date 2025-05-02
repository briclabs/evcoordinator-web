import { TestBed } from '@angular/core/testing';

import { StaticLookupService } from './static-lookup.service';

describe('StaticLookupService', () => {
  let service: StaticLookupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaticLookupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
