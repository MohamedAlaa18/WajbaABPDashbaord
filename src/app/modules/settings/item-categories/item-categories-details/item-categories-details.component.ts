import { Component } from '@angular/core';
import { UpdateBranchDto } from '@proxy/dtos/branch-contract';
import { SettingsSidebarComponent } from "../../settings-sidebar/settings-sidebar.component";
import { CategoryService } from '@proxy/controllers';
import { ActivatedRoute } from '@angular/router';
import { CategoryDto, UpdateCategory } from '@proxy/dtos/categories';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-categories-details',
  standalone: true,
  imports: [SettingsSidebarComponent, CommonModule],
  templateUrl: './item-categories-details.component.html',
  styleUrl: './item-categories-details.component.scss'
})
export class ItemCategoriesDetailsComponent {
  selectedCategory!: CategoryDto;

  constructor(
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
  ) { }

  ngOnInit(): void {
    // Get the ID from the route
    const categoryId = this.activatedRoute.snapshot.paramMap.get('id'); // Get the branch ID from the route

    if (categoryId) {
      this.categoryService.getById(Number(categoryId)).subscribe(
        (response) => {
          console.log(response);
          this.selectedCategory = response.data;
        },
        (error) => {
          console.error('Error fetching category details:', error);
        }
      );
    }
  }
}
