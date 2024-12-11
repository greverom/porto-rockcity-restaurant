import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaDeVentaReportesComponent } from './nota-de-venta-reportes.component';

describe('NotaDeVentaReportesComponent', () => {
  let component: NotaDeVentaReportesComponent;
  let fixture: ComponentFixture<NotaDeVentaReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaDeVentaReportesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotaDeVentaReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
