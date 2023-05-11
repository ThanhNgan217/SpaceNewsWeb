import { TestBed } from '@angular/core/testing';

import { CanLoginService } from './can-login.service';

describe('CanLoginService', () => {
  let service: CanLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
