import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrenciesService } from '@proxy/controllers';
import { CreateUpdateCurrenciesDto, UpadteCurrency } from '@proxy/dtos/currencies-contract';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { IconsComponent } from "../../../../shared/icons/icons.component";

@Component({
  selector: 'app-add-currencies',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, IconsComponent],
  templateUrl: './add-currencies.component.html',
  styleUrl: './add-currencies.component.scss'
})
export class AddCurrenciesComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() currency: UpadteCurrency | null = null;
  @Output() close = new EventEmitter<void>();

  currencyForm: FormGroup;
  selectedImage!: File;

  constructor(
    private fb: FormBuilder,
    private afterActionService: AfterActionService,
    private currencyService: CurrenciesService,
  ) {
    this.currencyForm = this.fb.group({
      name: ['', Validators.required],
      symbol: ['', Validators.required],
      code: ['', Validators.required],
      exchangeRate: ['', [Validators.required, Validators.min(0)]],
      isCryptoCurrency: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.currency) {
      this.populateForm(this.currency);
    }
  }

  populateForm(currency: UpadteCurrency) {
    this.currencyForm.patchValue({
      name: currency.name,
      symbol: currency.symbol,
      code: currency.code,
      exchangeRate: currency.exchangeRate,
      isCryptoCurrency: currency.isCryptoCurrency,
    });
  }

  // Method to close the modal
  closeModal() {
    this.close.emit();
  }

  // Handle form submission (add or edit currency)
  submitForm() {
    if (this.currencyForm.valid) {
      const formValue = this.currencyForm.value;

      console.log('Form values:', formValue);

      // Ensure isCryptoCurrency is a boolean value (either true or false)
      if (formValue.hasOwnProperty('isCryptoCurrency')) {
        formValue.isCryptoCurrency = Boolean(formValue.isCryptoCurrency); // Ensure boolean type
      }

      if (this.currency) {
        // Ensure formValue has the 'id' property for update
        const updatePayload: UpadteCurrency = {
          ...formValue,
          id: this.currency.id // Assign the `id` from the current currency
        };

        this.currencyService.update(updatePayload)
          .subscribe(
            response => {
              console.log('Currency updated:', response);
              this.closeModal();
              this.afterActionService.reloadCurrentRoute();
            },
            error => {
              console.error('Error updating currency:', error);
            }
          );
      } else {
        // Create new currency
        const createPayload: CreateUpdateCurrenciesDto = {
          ...formValue
        };

        this.currencyService.create(createPayload)
          .subscribe(
            response => {
              console.log('Currency added:', response);
              this.closeModal();
              this.afterActionService.reloadCurrentRoute();
            },
            error => {
              console.error('Error adding currency:', error);
            }
          );
      }
    } else {
      this.currencyForm.markAllAsTouched();
    }
  }
}
