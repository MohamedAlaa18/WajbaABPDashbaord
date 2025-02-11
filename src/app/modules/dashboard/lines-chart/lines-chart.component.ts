import { Component, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-lines-chart',
  standalone: true,
  imports: [],
  templateUrl: './lines-chart.component.html',
  styleUrl: './lines-chart.component.scss'
})
export class LinesChartComponent implements AfterViewInit {
  @Input() backgroundColor: string;
  @Input() borderColor: string;
  @Input() label: string;

  @ViewChild('salesChart') salesChart!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    new Chart(this.salesChart.nativeElement, {
      type: 'bar',
      data: {
        labels: Array.from({ length: 31 }, (_, i) => i + 1),
        datasets: [{
          label: this.label,
          data: Array.from({ length: 31 }, () => Math.floor(Math.random() * 1000)),
          backgroundColor: this.backgroundColor,
          borderColor: this.borderColor,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}
