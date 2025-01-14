import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDiningTablesComponent } from './add-dining-tables.component';

describe('AddDiningTablesComponent', () => {
  let component: AddDiningTablesComponent;
  let fixture: ComponentFixture<AddDiningTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDiningTablesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDiningTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
