import { TestBed } from '@angular/core/testing';

import { CanActivateGuardGuard } from './can-activate-guard.guard';

describe('CanActivateGuardGuard', () => {
  let guard: CanActivateGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanActivateGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
