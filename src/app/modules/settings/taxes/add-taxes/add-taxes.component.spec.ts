import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaxesComponent } from './add-taxes.component';

describe('AddTaxesComponent', () => {
  let component: AddTaxesComponent;
  let fixture: ComponentFixture<AddTaxesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTaxesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTaxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
