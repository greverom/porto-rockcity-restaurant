import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudMesasComponent } from './crud-mesas.component';

describe('CrudMesasComponent', () => {
  let component: CrudMesasComponent;
  let fixture: ComponentFixture<CrudMesasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudMesasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrudMesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
