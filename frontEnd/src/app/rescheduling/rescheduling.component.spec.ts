import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReschedulingComponent } from './rescheduling.component';

describe('ReschedulingComponent', () => {
  let component: ReschedulingComponent;
  let fixture: ComponentFixture<ReschedulingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReschedulingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReschedulingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
