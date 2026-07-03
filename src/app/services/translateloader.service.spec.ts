import { TestBed } from '@angular/core/testing';

import { TranslateloaderService } from './translateloader.service';

describe('TranslateloaderService', () => {
  let service: TranslateloaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslateloaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});