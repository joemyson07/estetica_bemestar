import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEstoqueComponent } from './admin-estoque.component';

describe('AdminEstoqueComponent', () => {
  let component: AdminEstoqueComponent;
  let fixture: ComponentFixture<AdminEstoqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEstoqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminEstoqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
