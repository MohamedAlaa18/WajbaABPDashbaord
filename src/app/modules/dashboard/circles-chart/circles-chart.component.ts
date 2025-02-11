import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-circles-chart',
  standalone: true,
  imports: [],
  templateUrl: './circles-chart.component.html',
  styleUrl: './circles-chart.component.scss'
})
export class CirclesChartComponent implements AfterViewInit{
  @ViewChild('orderChart') orderChart!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    new Chart(this.orderChart.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Delivered', 'Returned', 'Canceled', 'Rejected'],
        datasets: [{
          data: [40, 10, 20, 30],
          backgroundColor: ['#295FE8', '#CC02FF', '#FF3C3C', '#CE7E34']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
}
