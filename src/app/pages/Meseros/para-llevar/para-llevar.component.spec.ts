import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParaLlevarComponent } from './para-llevar.component';

describe('ParaLlevarComponent', () => {
  let component: ParaLlevarComponent;
  let fixture: ComponentFixture<ParaLlevarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParaLlevarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParaLlevarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
