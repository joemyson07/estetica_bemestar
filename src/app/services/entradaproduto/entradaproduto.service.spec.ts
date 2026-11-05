import { TestBed } from '@angular/core/testing';

import { EntradaprodutoService } from './entradaproduto.service';

describe('EntradaprodutoService', () => {
  let service: EntradaprodutoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntradaprodutoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
