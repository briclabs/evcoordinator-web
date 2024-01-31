import { TestBed } from '@angular/core/testing';

import { ContactUtilityServiceService } from './contact-utility-service.service';

describe('ContactUtilityServiceService', () => {
  let service: ContactUtilityServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactUtilityServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
