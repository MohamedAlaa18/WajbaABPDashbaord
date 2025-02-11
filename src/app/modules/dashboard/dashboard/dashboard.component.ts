import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsComponent } from 'src/app/shared/icons/icons.component';
import { LinesChartComponent } from "../lines-chart/lines-chart.component";
import { CirclesChartComponent } from "../circles-chart/circles-chart.component";
import { WajbaUserDto } from '@proxy/dtos/wajba-users-contract';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, IconsComponent, LinesChartComponent, CirclesChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  user: WajbaUserDto;

  dashboardOverviewCards = [
    {
      label: 'Total sales',
      value: 'QAR 0.00',
      bgColor: '#F45859',
      iconName: 'totalSales'
    },
    {
      label: 'Total orders',
      value: '0',
      bgColor: '#295FE8',
      iconName: 'totalOrders'
    },
    {
      label: 'Total customer',
      value: '0',
      bgColor: '#CC02FF',
      iconName: 'totalCustomer'
    },
    {
      label: 'Total menu items',
      value: '0',
      bgColor: '#CE7E34',
      iconName: 'totalMenuItems'
    }
  ];

  dashboardOrderStatisticsCards = [
    {
      label: 'Total Orders',
      value: '0',
      iconColor: '#F45859',
      bgColor: '#F4585940',
      iconName: 'totalOrders_2'
    },
    {
      label: 'Pending',
      value: '0',
      iconColor: '#FF9F47',
      bgColor: '#FFAE6340',
      iconName: 'pending'
    },
    {
      label: 'Processing',
      value: '0',
      iconColor: '#50AF60',
      bgColor: '#56E36D40',
      iconName: 'processing'
    },
    {
      label: 'Delivered',
      value: '0',
      iconColor: '#328DE0',
      bgColor: '#328DE040',
      iconName: 'delivered'
    },
    {
      label: 'Delivered',
      value: '0',
      iconColor: '#3859AD',
      bgColor: '#328DE054',
      iconName: 'delivered_2'
    },
    {
      label: 'Canceled',
      value: '0',
      iconColor: '#FF3C3C',
      bgColor: '#FF3C3C3D',
      iconName: 'canceled'
    },
    {
      label: 'Returned',
      value: '0',
      iconColor: '#CC02FF',
      bgColor: '#DD5FFD40',
      iconName: 'returned'
    },
    {
      label: 'Rejected',
      value: '0',
      iconColor: '#FF3C3C',
      bgColor: '#FF3C3C3D',
      iconName: 'canceled'
    }
  ];

  featuredItems = [
    {
      name: 'Cheese Burger',
      category: 'Burger',
      price: 'QAR 5.00',
      imageUrl: 'assets/images/burger-with-bg-black.jpg'
    },
    {
      name: 'Cheese Burger',
      category: 'Burger',
      price: 'QAR 7.50',
      imageUrl: 'assets/images/burger-with-bg-black.jpg'
    },
    {
      name: 'Chicken Wrap',
      category: 'Wrap',
      price: 'QAR 4.00',
      imageUrl: 'assets/images/burger-with-bg-black.jpg'
    }
  ];

  popularItems = [
    {
      name: 'Cheese Burger',
      category: 'Burger',
      price: 'QAR 5.00',
      imageUrl: 'assets/images/burger-with-bg-black.jpg'
    },
    {
      name: 'Veggie Pizza',
      category: 'Pizza',
      price: 'QAR 10.00',
      imageUrl: 'assets/images/burger-with-bg-black.jpg'
    }
  ];

  ngOnInit(): void {
    const storedUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    if (storedUserData) {
      this.user = JSON.parse(storedUserData);
    }
  }
}
