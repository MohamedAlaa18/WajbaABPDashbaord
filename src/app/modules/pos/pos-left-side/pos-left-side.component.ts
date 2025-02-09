import { Component, HostListener, OnInit } from '@angular/core';
import { IconsComponent } from "../../../shared/icons/icons.component";
import { GetBranchInput } from '@proxy/dtos/branch-contract';
import { CategoryService, ItemService } from '@proxy/controllers';
import { ItemDto } from '@proxy/dtos/items-dtos';
import { UpdateCategory } from '@proxy/dtos/categories';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pos-left-side',
  standalone: true,
  imports: [IconsComponent, ProductCardComponent, CommonModule],
  templateUrl: './pos-left-side.component.html',
  styleUrl: './pos-left-side.component.scss'
})
export class PosLeftSideComponent implements OnInit{
  categories: UpdateCategory[] = [];
  items: ItemDto[] = [];
  selectedCategoryId: number | undefined = undefined;
  searchQuery: string = '';
  selectedPageIndex = 0;
  pageCount = 3;

  constructor(
    private categoryService: CategoryService,
    private itemService: ItemService,
  ) { }

  ngOnInit(): void {
    this.loadCategory();
    this.loadItems();
  }

  loadItems(): void {
    this.itemService.getItemsByCategoryByCategoryIdAndName(this.selectedCategoryId, this.searchQuery).subscribe({
      next: (response) => {
        console.log(response);
        this.items = response.data.items;
      },
      error: (err) => {
        console.error('Error loading items:', err);
      },
    });
  }

  loadCategory(): void {
    const defaultInput: GetBranchInput = {
      filter: '',
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.categoryService.getList(defaultInput).subscribe({
      next: (response) => {
        console.log(response)
        this.categories = response.data.items;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  selectCategory(categoryId: number) {
    categoryId === 0 ?
      this.selectedCategoryId = undefined :
      this.selectedCategoryId = categoryId;
    this.loadItems();
  }

  // Handle scroll to update selected page index based on position
  @HostListener('wheel', ['$event'])
  onScroll(event: WheelEvent): void {
    const scrollContainer = document.querySelector('.categories-container');
    const categories = Array.from(document.querySelectorAll('.category-button'));

    if (scrollContainer) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerLeft = containerRect.left;

      // Define zones within the container
      const leftThird = containerLeft + containerWidth * 0.33;
      const rightThird = containerLeft + containerWidth * 0.66;

      let closestCategoryIndex = 0;
      let minDistance = Infinity;

      categories.forEach((category, index) => {
        const categoryRect = category.getBoundingClientRect();
        const categoryCenterX = categoryRect.left + categoryRect.width / 2;

        // Determine which zone the category is in
        let zonePosition;
        if (categoryCenterX < leftThird) {
          zonePosition = 'left';
        } else if (categoryCenterX > rightThird) {
          zonePosition = 'right';
        } else {
          zonePosition = 'center';
        }

        // Calculate distance from the container's center
        const distanceFromCenter = Math.abs(categoryCenterX - (containerLeft + containerWidth / 2));

        // Update closest category if this one is closer to the center
        if (distanceFromCenter < minDistance) {
          minDistance = distanceFromCenter;
          closestCategoryIndex = index;
        }
      });

      // Update selected page index
      this.selectedPageIndex = Math.max(0, closestCategoryIndex - 1)
      // console.log(this.selectedPageIndex);
    }
  }

  selectPage(index: number): void {
    this.selectedPageIndex = index;
    this.scrollToPage(index);
  }

  scrollToPage(index: number): void {
    // Get the container element
    const container = document.querySelector('.categories-container') as HTMLElement;

    // Get the first category card position
    const firstCategory = container.querySelector('.category-button') as HTMLElement;

    if (firstCategory) {
      // Calculate the width of each category card including gap
      const categoryWidth = firstCategory.offsetWidth + parseFloat(getComputedStyle(firstCategory).marginRight || '0');

      // Calculate the scroll position based on the first category card and the index
      const scrollPosition = categoryWidth * index;

      // Scroll smoothly to the calculated position
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  }

  searchAction(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value;
    this.loadItems();
  }

  trackByKey(index: number, item: any) {
    return item?.id;
  }
}
