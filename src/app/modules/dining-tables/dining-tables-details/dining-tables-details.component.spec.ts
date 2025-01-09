import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiningTablesDetailsComponent } from './dining-tables-details.component';

describe('DiningTablesDetailsComponent', () => {
  let component: DiningTablesDetailsComponent;
  let fixture: ComponentFixture<DiningTablesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiningTablesDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiningTablesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
