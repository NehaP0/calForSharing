import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMeetingComponentComponent } from './create-meeting-component.component';

describe('CreateMeetingComponentComponent', () => {
  let component: CreateMeetingComponentComponent;
  let fixture: ComponentFixture<CreateMeetingComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateMeetingComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateMeetingComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
