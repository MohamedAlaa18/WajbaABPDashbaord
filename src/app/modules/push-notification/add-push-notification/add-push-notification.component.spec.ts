import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPushNotificationComponent } from './add-push-notification.component';

describe('AddPushNotificationComponent', () => {
  let component: AddPushNotificationComponent;
  let fixture: ComponentFixture<AddPushNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPushNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPushNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
