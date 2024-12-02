import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAlimentosComponent } from './gestion-alimentos.component';

describe('GestionAlimentosComponent', () => {
  let component: GestionAlimentosComponent;
  let fixture: ComponentFixture<GestionAlimentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionAlimentosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionAlimentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
