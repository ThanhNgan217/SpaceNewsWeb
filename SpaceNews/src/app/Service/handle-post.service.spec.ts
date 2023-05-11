import { TestBed } from '@angular/core/testing';

import { HandlePostService } from './handle-post.service';

describe('HandlePostService', () => {
  let service: HandlePostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandlePostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
