import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BranchService, CurrenciesService, LanguageService, SiteService } from '@proxy/controllers';
import { SettingsSidebarComponent } from "../settings-sidebar/settings-sidebar.component";
import { GetBranchInput } from '@proxy/dtos/branch-contract';
import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { CreateSiteDto } from '@proxy/dtos/sites-contact';

@Component({
  selector: 'app-site',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SettingsSidebarComponent],
  templateUrl: './site.component.html',
  styleUrl: './site.component.scss'
})
export class SiteComponent implements OnInit {
  siteForm: FormGroup;
  logoFile: File | null = null;

  languages: { value: string, viewValue: string }[] = [];
  branches: { value: string, viewValue: string }[] = [];
  currencies: { value: string, viewValue: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private siteService: SiteService,
    private branchService: BranchService,
    private languageService: LanguageService,
    private currenciesService: CurrenciesService
  ) {
    // Initialize the form with default values and validators
    this.siteForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      defaultLanguage: ['', Validators.required],
      defaultBranch: ['', Validators.required],
      androidAPPLink: ['', [Validators.required, Validators.pattern('https?://.+')]],
      iosappLink: ['', [Validators.required, Validators.pattern('https?://.+')]],
      copyrights: ['', Validators.required],
      googleMapKey: ['', Validators.required],
      digitAfterDecimal: ['', [Validators.min(0), Validators.required]],
      defaultCurrency: ['', Validators.required],
      currencyPosition: [1, Validators.required],
      languageSwitch: [1, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadSite();
    this.loadCurrencies();
    this.loadBranches();
    this.loadLanguages();
  }

  loadSite(): void {
    this.siteService.getById().subscribe(
      (response) => {
        console.log(response);
        this.siteForm.patchValue({
          name: response.data.name,
          email: response.data.email,
          iosappLink: response.data.iosappLink, // Ensure correct casing
          androidAPPLink: response.data.androidAPPLink, // Ensure correct casing
          copyrights: response.data.copyrights,
          googleMapKey: response.data.googleMapKey,
          digitAfterDecimal: response.data.quantity,
          currencyPosition: response.data.currencyPosition,
          languageSwitch: response.data.languageSwitch,
          defaultBranch: response.data.branchId,
          defaultCurrency: response.data.currencyId,
          defaultLanguage: response.data.languageId,
        });
      },
      (error) => {
        console.error('Error fetching company:', error);
      }
    );
  }

  loadLanguages(): void {
    const defaultInput: PagedAndSortedResultRequestDto = {
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.languageService.getAllByDto(defaultInput).subscribe({
      next: (languages) => {
        console.log(languages)
        this.languages = languages.data.items.map(lang => ({
          value: lang.id,
          viewValue: lang.name
        }));
      },
      error: (error) => {
        console.error('Error fetching languages:', error);
      }
    });
  }

  loadBranches(): void {
    const defaultInput: GetBranchInput = {
      filter: '',
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.branchService.getList(defaultInput).subscribe({
      next: (branches) => {
        console.log(branches);
        this.branches = branches.data.items.map(branch => ({
          value: branch.id,
          viewValue: branch.name
        }));
      },
      error: (error) => {
        console.error('Error fetching branches:', error);
      }
    });
  }

  loadCurrencies(): void {
    const defaultInput: PagedAndSortedResultRequestDto = {
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.currenciesService.getList(defaultInput).subscribe({
      next: (currencies) => {
        console.log(currencies);
        this.currencies = currencies.data.items.map(currency => ({
          value: currency.id,
          viewValue: currency.name
        }));
      },
      error: (error) => {
        console.error('Error fetching currencies:', error);
      }
    });
  }

  submitForm() {
    if (this.siteForm.valid) {
      const formValue = this.siteForm.value as CreateSiteDto;
      console.log(formValue);
      this.siteService.update(formValue).subscribe({
        next: (response) => {
          console.log('Form submitted successfully!', response);
        },
        error: (error) => {
          console.error('Form submission error:', error);
        }
      });
    } else {
      this.siteForm.markAllAsTouched();
    }
  }
}
