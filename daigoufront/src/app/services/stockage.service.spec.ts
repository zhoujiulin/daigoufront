import { TestBed } from '@angular/core/testing';

import { StockageService } from './stockage.service';

describe('StockageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StockageService = TestBed.get(StockageService);
    expect(service).toBeTruthy();
  });
});
