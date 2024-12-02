import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosCocinaComponent } from './pedidos-cocina.component';

describe('PedidosCocinaComponent', () => {
  let component: PedidosCocinaComponent;
  let fixture: ComponentFixture<PedidosCocinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidosCocinaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PedidosCocinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
