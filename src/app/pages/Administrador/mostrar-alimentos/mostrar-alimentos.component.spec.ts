import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostrarAlimentosComponent } from './mostrar-alimentos.component';

describe('MostrarAlimentosComponent', () => {
  let component: MostrarAlimentosComponent;
  let fixture: ComponentFixture<MostrarAlimentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostrarAlimentosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MostrarAlimentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
