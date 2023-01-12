import { TestBed } from '@angular/core/testing';

import { VipGuard } from './vip.guard';

describe('VipGuard', () => {
  let guard: VipGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(VipGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
