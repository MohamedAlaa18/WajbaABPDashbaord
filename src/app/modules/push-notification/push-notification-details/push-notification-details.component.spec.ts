import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushNotificationDetailsComponent } from './push-notification-details.component';

describe('PushNotificationDetailsComponent', () => {
  let component: PushNotificationDetailsComponent;
  let fixture: ComponentFixture<PushNotificationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PushNotificationDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PushNotificationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
