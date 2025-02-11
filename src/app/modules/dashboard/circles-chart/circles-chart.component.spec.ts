import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CirclesChartComponent } from './circles-chart.component';

describe('CirclesChartComponent', () => {
  let component: CirclesChartComponent;
  let fixture: ComponentFixture<CirclesChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CirclesChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CirclesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
