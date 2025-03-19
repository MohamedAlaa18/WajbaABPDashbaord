import { Component } from '@angular/core';
import { TableComponent } from 'src/app/shared/table/table.component';
import { SettingsSidebarComponent } from '../../settings-sidebar/settings-sidebar.component';
import { IconsComponent } from 'src/app/shared/icons/icons.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LanguageService } from '@proxy/controllers';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { ConfirmDeleteModalComponent } from 'src/app/shared/confirm-delete-modal/confirm-delete-modal.component';
import { AddLanguagesComponent } from '../add-languages/add-languages.component';
import { UpdateLanguagedto } from '@proxy/dtos/languages';
import { PaginationComponent } from "../../../../shared/pagination/pagination.component";

@Component({
  selector: 'app-languages',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconsComponent, SettingsSidebarComponent, TableComponent, PaginationComponent],
  templateUrl: './languages.component.html',
  styleUrl: './languages.component.scss'
})
export class LanguagesComponent {
  languages: UpdateLanguagedto[] = [];
  isAddMode = true;
  currentPage: number = 1;
  totalPages: number = 4;

  columns = [
    { field: 'name', header: 'Name' },
    { field: 'code', header: 'Code' },
    { field: 'status', header: 'Status' },
  ];

  actions = [
    {
      icon: 'assets/images/edit.svg',
      tooltip: 'Edit',
      show: (row: any) => true,
      callback: (row: any) => this.openAddEditModal(row),
    },
    {
      icon: 'assets/images/view.svg',
      tooltip: 'View',
      show: (row: any) => true,
      callback: (row: any) => this.openLanguageDetailsAndNavigate(row),
    },
    {
      icon: 'assets/images/delete.svg',
      tooltip: 'Delete',
      show: (row: any) => true,
      callback: (row: any) => this.openConfirmDeleteModal(row.id, row.name),
    },
  ];

  constructor(
    private modalService: NgbModal,
    private languageService: LanguageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadLanguages();
  }

  // Load all languages
  loadLanguages(): void {
    const defaultInput: PagedAndSortedResultRequestDto = {
      sorting: '',
      skipCount: (this.currentPage - 1) * 10,
      maxResultCount: 10
    };

    this.languageService.getAllByDto(defaultInput).subscribe({
      next: (response) => {
        console.log(response)
        this.languages = response.data.items;
        this.totalPages = Math.ceil(response.data.totalCount / 10); // Update total pages
      },
      error: (err) => {
        console.error('Error loading languages:', err);
      },
    });
  }

  openAddEditModal(language?: UpdateLanguagedto): void {
    const modalRef = this.modalService.open(AddLanguagesComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.isOpen = true;
    modalRef.componentInstance.language = language || null;

    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
      this.loadLanguages();
    });

    modalRef.result
      .then((result) => {
        if (result === 'saved') {
          this.loadLanguages();
        }
      })
      .catch((reason) => {
        console.log('Modal dismissed:', reason);
      });
  }

  openConfirmDeleteModal(languageId: number, languageName: string): void {
    const modalRef = this.modalService.open(ConfirmDeleteModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    // Pass data to the modal instance
    modalRef.componentInstance.id = languageId;
    modalRef.componentInstance.name = languageName;

    // Handle modal result
    modalRef.componentInstance.confirmDelete.subscribe((id) => {
      this.deleteLanguage(id); // Call the delete method with the language ID
    });

    modalRef.componentInstance.cancelDelete.subscribe(() => {
      modalRef.close(); // Close modal on cancel
    });
  }

  deleteLanguage(id: number): void {
    this.languageService.delete(id).subscribe({
      next: () => {
        this.languages = this.languages.filter((branch) => branch.id !== id);
        this.modalService.dismissAll(); // Close all modals
      },
      error: (err) => {
        console.error('Error deleting branch:', err);
      },
    });
  }

  openLanguageDetailsAndNavigate(branch: UpdateLanguagedto) {
    this.router.navigate(['/settings/languages', branch.id]);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadLanguages();
  }
}
