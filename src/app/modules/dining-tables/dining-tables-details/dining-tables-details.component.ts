import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DineIntableService } from '@proxy/controllers';
import { CreateDineIntable } from '@proxy/dtos/dine-in-table-contract';

@Component({
  selector: 'app-dining-tables-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dining-tables-details.component.html',
  styleUrl: './dining-tables-details.component.scss'
})
export class DiningTablesDetailsComponent {
  diningTable!: CreateDineIntable;
  tableId!: number;

  constructor(
    private dineIntableService: DineIntableService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.tableId = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    this.loadDiningTable(this.tableId);
  }

  loadDiningTable(id: number) {
    this.dineIntableService.getById(id).subscribe(
      (response) => {
        console.log('Dining Table:', response);
        this.diningTable = response.data;
      },
      (error) => {
        console.error('Error fetching dining table:', error);
      }
    );
  }
}
