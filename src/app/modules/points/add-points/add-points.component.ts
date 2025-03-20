import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ItemService } from '@proxy/controllers';
import { AddPointsToItemDto, GetItemInput, ItemDto } from '@proxy/dtos/items-dtos';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { IconsComponent } from 'src/app/shared/icons/icons.component';

@Component({
  selector: 'app-add-points',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent, NgSelectModule],
  templateUrl: './add-points.component.html',
  styleUrl: './add-points.component.scss'
})
export class AddPointsComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() item: ItemDto | null = null;
  @Output() close = new EventEmitter<void>();

  items: ItemDto[] = [];
  pointsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private afterActionService: AfterActionService,
  ) {
    this.pointsForm = this.fb.group({
      itemId: ['', Validators.required],
      points: ['', Validators.required],
      status: [1, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadItems();

    if (this.item) {
      this.populateForm(this.item);
    }
  }

  populateForm(item: ItemDto) {
    this.pointsForm.patchValue({
      itemId: item.id,
      points: item.points,
      status: item.status,
    });
  }

  loadItems(): void {
    const selectedBranch = JSON.parse(localStorage.getItem('selectedBranch'));

    const input: GetItemInput = {
      sorting: '',
      skipCount: 0,
      maxResultCount: undefined,
      branchId: selectedBranch.id
    };

    this.itemService.getList(input).subscribe({
      next: (response) => {
        console.log(response);
        this.items = response.data.items.filter(item => item.points === 0);
      },
      error: (err) => {
        console.error('Error loading items:', err);
      },
    });
  }

  closeModal() {
    this.close.emit();
  }

  submitForm(): void {
    if (this.pointsForm.valid) {
      let formValue: AddPointsToItemDto;

      // Determine whether it's an update or create operation
      formValue = this.pointsForm.value as AddPointsToItemDto;

      if (this.item) {
        // Update existing voucher
        this.itemService.updatePointsOfItemByInput(formValue as AddPointsToItemDto).subscribe(
          response => {
            console.log(response);
            this.closeModal();
            this.afterActionService.reloadCurrentRoute();
          },
          error => {
            console.error(error);
          }
        );
      } else {
        // Create a new voucher
        this.itemService.addPointsToItemByInput(formValue as AddPointsToItemDto).subscribe(
          response => {
            console.log(response);
            this.closeModal();
            this.afterActionService.reloadCurrentRoute();
          },
          error => {
            console.error(error);
          }
        );
      }
    } else {
      // Mark all form controls as touched to trigger validation messages
      this.pointsForm.markAllAsTouched();
    }
  }
}
