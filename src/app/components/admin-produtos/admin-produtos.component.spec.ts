import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProdutosComponent } from './admin-produtos.component';

describe('AdminProdutosComponent', () => {
  let component: AdminProdutosComponent;
  let fixture: ComponentFixture<AdminProdutosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProdutosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminProdutosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
