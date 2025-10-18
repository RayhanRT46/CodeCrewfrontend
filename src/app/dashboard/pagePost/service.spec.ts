import { TestBed } from '@angular/core/testing';

import { PostPageService } from './service';

describe('Service', () => {
  let service: PostPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
