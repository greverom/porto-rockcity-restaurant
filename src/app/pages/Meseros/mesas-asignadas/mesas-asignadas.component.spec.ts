import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesasAsignadasComponent } from './mesas-asignadas.component';

describe('MesasAsignadasComponent', () => {
  let component: MesasAsignadasComponent;
  let fixture: ComponentFixture<MesasAsignadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesasAsignadasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MesasAsignadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
