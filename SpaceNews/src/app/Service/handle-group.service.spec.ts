import { TestBed } from '@angular/core/testing';

import { HandleGroupService } from './handle-group.service';

describe('HandleGroupService', () => {
  let service: HandleGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandleGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
