import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemReportsComponent } from './item-reports.component';

describe('ItemReportsComponent', () => {
  let component: ItemReportsComponent;
  let fixture: ComponentFixture<ItemReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
