import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceSemanalComponent } from './balance-semanal.component';

describe('BalanceSemanalComponent', () => {
  let component: BalanceSemanalComponent;
  let fixture: ComponentFixture<BalanceSemanalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceSemanalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BalanceSemanalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
