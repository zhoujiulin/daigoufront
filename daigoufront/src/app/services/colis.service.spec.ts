import { TestBed } from '@angular/core/testing';

import { ColisService } from './colis.service';

describe('ColisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ColisService = TestBed.get(ColisService);
    expect(service).toBeTruthy();
  });
});
