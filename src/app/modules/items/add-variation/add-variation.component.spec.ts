import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVariationComponent } from './add-variation.component';

describe('AddVariationComponent', () => {
  let component: AddVariationComponent;
  let fixture: ComponentFixture<AddVariationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVariationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVariationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
