import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLanguagesComponent } from './add-languages.component';

describe('AddLanguagesComponent', () => {
  let component: AddLanguagesComponent;
  let fixture: ComponentFixture<AddLanguagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLanguagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddLanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
