import { TestBed } from '@angular/core/testing';

import { HostImageService } from './host-image.service';

describe('HostImageService', () => {
  let service: HostImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HostImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
