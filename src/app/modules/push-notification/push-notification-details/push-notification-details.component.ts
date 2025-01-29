import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '@proxy/controllers';
import { CommonModule } from '@angular/common';
import { LanguageDto } from '@proxy/dtos/languages';

@Component({
  selector: 'app-push-notification-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './push-notification-details.component.html',
  styleUrl: './push-notification-details.component.scss'
})
export class PushNotificationDetailsComponent implements OnInit {
  selectedPushNotification!: LanguageDto;

  constructor(
    private activatedRoute: ActivatedRoute,
    private languageService: LanguageService,
  ) { }

  ngOnInit(): void {
    // Get the ID from the route
    const languageId = this.activatedRoute.snapshot.paramMap.get('id'); // Get the branch ID from the route

    if (languageId) {
      this.languageService.getById(Number(languageId)).subscribe(
        (response) => {
          console.log(response);
          this.selectedPushNotification = response.data;
        },
        (error) => {
          console.error('Error fetching language details:', error);
        }
      );
    }
  }
}
