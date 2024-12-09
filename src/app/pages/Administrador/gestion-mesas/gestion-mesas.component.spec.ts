import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionMesasComponent } from './gestion-mesas.component';

describe('GestionMesasComponent', () => {
  let component: GestionMesasComponent;
  let fixture: ComponentFixture<GestionMesasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionMesasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionMesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
