import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsComponent } from 'src/app/shared/icons/icons.component';
import { LinesChartComponent } from "../lines-chart/lines-chart.component";
import { CirclesChartComponent } from "../circles-chart/circles-chart.component";
import { WajbaUserDto } from '@proxy/dtos/wajba-users-contract';
import { GetItemInput, ItemDto } from '@proxy/dtos/items-dtos';
import { ItemService, PopularItemsService } from '@proxy/controllers';
import { PagedAndSortedResultRequestDto } from '@abp/ng.core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, IconsComponent, LinesChartComponent, CirclesChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  user: WajbaUserDto;
  featuredItems: ItemDto[] = [
    {
      name: 'Cheese Burger',
      categoryName: 'Burger',
      price: 5,
      imageUrl: 'assets/images/burger-with-bg-black.jpg',
      id: 0,
      status: 0,
      isFeatured: false,
      categoryId: 0,
      itemType: 0,
      isDeleted: false,
      branchIds: [],
      itemAddons: [],
      itemExtras: [],
      itemVariations: [],
      points: 0,
    },
    {
      name: 'Cheese Burger',
      categoryName: 'Burger',
      price: 7.50,
      imageUrl: 'assets/images/burger-with-bg-black.jpg',
      id: 1,
      status: 0,
      isFeatured: false,
      categoryId: 0,
      itemType: 0,
      isDeleted: false,
      branchIds: [],
      itemAddons: [],
      itemExtras: [],
      itemVariations: [],
      points: 0,
    },
    {
      name: 'Chicken Wrap',
      categoryName: 'Wrap',
      price: 4,
      imageUrl: 'assets/images/burger-with-bg-black.jpg',
      id: 2,
      status: 0,
      isFeatured: false,
      categoryId: 0,
      itemType: 0,
      isDeleted: false,
      branchIds: [],
      itemAddons: [],
      itemExtras: [],
      itemVariations: [],
      points: 0,
    }
  ];

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

  popularItems = [
    {
      name: 'Cheese Burger',
      categoryName: 'Burger',
      price: 5,
      imageUrl: 'assets/images/burger-with-bg-black.jpg'
    },
    {
      name: 'Veggie Pizza',
      categoryName: 'Pizza',
      price: 10,
      imageUrl: 'assets/images/burger-with-bg-black.jpg'
    }
  ];

  constructor(
    private itemService: ItemService,
    private popularItemService: PopularItemsService
  ) { }

  ngOnInit(): void {
    // this.loadFeaturedItems();
    // this.loadPopularItems();

    const storedUserData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    if (storedUserData) {
      this.user = JSON.parse(storedUserData);
    }
  }

  loadFeaturedItems(): void {
    const selectedBranch = JSON.parse(localStorage.getItem('selectedBranch'));

    const input: GetItemInput = {
      sorting: '',
      skipCount: 0,
      maxResultCount: undefined,
      isFeatured: true,
    };

    this.itemService.getList(input).subscribe({
      next: (response) => {
        console.log(response);
        this.featuredItems = response.data.items;
      },
      error: (err) => {
        console.error('Error loading items:', err);
      },
    });
  }

  loadPopularItems(): void {
    const defaultInput: PagedAndSortedResultRequestDto = {
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.popularItemService.get(defaultInput).subscribe({
      next: (response) => {
        console.log(response)
        this.popularItems = response.data.items;
      },
      error: (err) => {
        console.error('Error loading items:', err);
      },
    });
  }
}
