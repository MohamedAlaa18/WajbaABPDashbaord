import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPopularTodayComponent } from './add-popular-today.component';

describe('AddPopularTodayComponent', () => {
  let component: AddPopularTodayComponent;
  let fixture: ComponentFixture<AddPopularTodayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPopularTodayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPopularTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
