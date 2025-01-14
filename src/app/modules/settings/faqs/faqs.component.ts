import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FaqService } from '@proxy/controllers';
import { IconsComponent } from "../../../shared/icons/icons.component";
import { SettingsSidebarComponent } from "../settings-sidebar/settings-sidebar.component";
import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { ConfirmDeleteModalComponent } from 'src/app/shared/confirm-delete-modal/confirm-delete-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IconsComponent, SettingsSidebarComponent],
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FAQsComponent implements OnInit {
  questionAnswerForm: FormGroup;
  isEditable: boolean[] = [];
  errorMessages: string[] = [];

  constructor(
    private fb: FormBuilder,
    private faqsService: FaqService,
    private modalService: NgbModal,
    private afterActionService: AfterActionService,
  ) {
    this.questionAnswerForm = this.fb.group({
      questions: this.fb.array([])
    });
  }

  ngOnInit() {
    this.loadFAQs();
  }

  // Get the form array of questions
  get questions(): FormArray {
    return this.questionAnswerForm.get('questions') as FormArray;
  }

  // Create a new question-answer form group
  createQuestionAnswer(id: number, question = '', answer = ''): FormGroup {
    return this.fb.group({
      id: [id],
      question: [question, Validators.required],
      answer: [answer, Validators.required]
    });
  }

  // Add a new question-answer form group to the form array
  addQuestion(id = null, question = '', answer = '') {
    this.questions.push(this.createQuestionAnswer(id, question, answer));
    this.isEditable.push(false); // Initially readonly
  }

  // Remove a question-answer form group from the form array
  removeQuestion(index: number) {
    if (this.questions.length > 1) {
      this.questions.removeAt(index);
      this.isEditable.splice(index, 1);
    }
  }

  // Toggle edit mode for a question-answer group
  toggleEdit(index: number) {
    this.isEditable[index] = !this.isEditable[index];
  }

  // Load FAQs from API and populate the form
  loadFAQs() {
    const defaultInput: PagedAndSortedResultRequestDto = {
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.faqsService.getList(defaultInput).subscribe(
      (response: any) => {
        response.data.items.forEach((faq: any) => {
          // Ensure that each FAQ's id is passed correctly
          this.addQuestion(faq.id, faq.question, faq.answer);
        });
      },
      error => {
        console.error('Error loading FAQs:', error);
      }
    );
  }

  // Save the form data
  onSave() {
    if (this.questionAnswerForm.valid) {
      const formValue = this.questionAnswerForm.value.questions;

      formValue.forEach((q: any, index: number) => {
        console.log(q)
        const payload = {
          id: q.id || null,
          question: q.question,
          answer: q.answer,
        };

        if (q.id) {
          // Update existing FAQ
          this.faqsService.update(payload).subscribe(
            response => {
              console.log(`FAQ updated successfully:`, response);
            },
            error => {
              console.error('Error updating FAQ:', error);
              this.handleApiErrors(error);
            }
          );
        } else {
          // Create new FAQ
          this.faqsService.create(payload).subscribe(
            response => {
              console.log(`FAQ created successfully:`, response);
            },
            error => {
              console.error('Error creating FAQ:', error);
              this.handleApiErrors(error);
            }
          );
        }
      });

    } else {
      this.questionAnswerForm.markAllAsTouched();
    }
  }

  // Handle API errors and map them to form
  handleApiErrors(error: any) {
    this.errorMessages = error?.error?.errors?.$ || ['An unexpected error occurred.'];
    console.error('Validation Errors:', this.errorMessages);
  }

  openConfirmDeleteModal(faqId: number, faqName: string): void {
    const modalRef = this.modalService.open(ConfirmDeleteModalComponent, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });

    // Pass data to the modal instance
    modalRef.componentInstance.id = faqId;
    modalRef.componentInstance.name = faqName;

    // Handle modal result
    modalRef.componentInstance.confirmDelete.subscribe((id: number) => {
      this.deleteFaq(id); // Call the delete method with the correct faq ID
      modalRef.close();
    });

    modalRef.componentInstance.cancelDelete.subscribe(() => {
      modalRef.close(); // Close modal on cancel
    });
  }

  deleteFaq(id: number): void {
    this.faqsService.delete(id).subscribe(() => {
      console.log(`FAQ with id: ${id} deleted successfully.`);
      this.afterActionService.reloadCurrentRoute(); // Reload the route after deletion
    }, (error) => {
      console.error('Failed to delete FAQ:', error);
    });
  }

}
