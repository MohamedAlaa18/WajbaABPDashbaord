import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderSetupService } from '@proxy/controllers';
import { SettingsSidebarComponent } from "../settings-sidebar/settings-sidebar.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PagedAndSortedResultRequestDto } from '@abp/ng.core';


@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SettingsSidebarComponent],
  templateUrl: './rewards.component.html',
  styleUrl: './rewards.component.scss'
})
export class RewardsComponent implements OnInit {
  rewardsForm: FormGroup;  // Renamed from orderForm to rewardsForm

  constructor(
    private fb: FormBuilder,
    private orderSetupService: OrderSetupService,
    private modalService: NgbModal
  ) {
    this.rewardsForm = this.fb.group({
      qarAmount: [null, Validators.required],
      pointsNumber: [null, Validators.required],
      pointsValidTime: [null, Validators.required],
      pointsRewardEnabled: [true, Validators.required],
      referralAmount: [null, Validators.required],
      referralValidTime: [null, Validators.required],
      referralEnabled: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRewardsSettings();
  }

  loadRewardsSettings(): void {
    // Update this method to fetch rewards-specific settings
    const defaultInput: PagedAndSortedResultRequestDto = {
      sorting: '',
      skipCount: 0,
      maxResultCount: 10
    };

    this.orderSetupService.getList(defaultInput).subscribe(
      (response) => {
        this.rewardsForm.patchValue({
          // qarAmount: response.data.items[0].qarAmount,
          // pointsNumber: response.data.items[0].pointsNumber,
          // pointsValidTime: response.data.items[0].pointsValidTime,
          // pointsRewardEnabled: response.data.items[0].pointsRewardEnabled,
          // referralAmount: response.data.items[0].referralAmount,
          // referralValidTime: response.data.items[0].referralValidTime,
          // referralEnabled: response.data.items[0].referralEnabled
        });
      },
      (error) => {
        console.error('Error fetching rewards settings', error);
      }
    );
  }

  onSubmit(): void {
    if (this.rewardsForm.valid) {
      const formValue = this.rewardsForm.value;
      // Update service call to use correct endpoint/DTO for rewards
      this.orderSetupService.update(formValue).subscribe(
        response => console.log('Settings saved successfully', response),
        error => console.error('Error saving settings', error)
      );
    }
  }
}
