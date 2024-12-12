import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudAlimentosComponent } from './crud-alimentos.component';

describe('CrudAlimentosComponent', () => {
  let component: CrudAlimentosComponent;
  let fixture: ComponentFixture<CrudAlimentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudAlimentosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrudAlimentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
