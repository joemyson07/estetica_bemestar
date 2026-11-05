import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEntradaComponent } from './admin-entrada.component';

describe('AdminEntradaComponent', () => {
  let component: AdminEntradaComponent;
  let fixture: ComponentFixture<AdminEntradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEntradaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminEntradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
