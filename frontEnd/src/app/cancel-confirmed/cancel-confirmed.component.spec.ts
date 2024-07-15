import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelConfirmedComponent } from './cancel-confirmed.component';

describe('CancelConfirmedComponent', () => {
  let component: CancelConfirmedComponent;
  let fixture: ComponentFixture<CancelConfirmedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelConfirmedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CancelConfirmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
