import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UpdateLanguagedto } from '@proxy/dtos/languages';
import { SettingsSidebarComponent } from '../../settings-sidebar/settings-sidebar.component';
import { LanguageService } from '@proxy/controllers';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-languages-details',
  standalone: true,
  imports: [SettingsSidebarComponent, CommonModule],
  templateUrl: './languages-details.component.html',
  styleUrl: './languages-details.component.scss',
})
export class LanguagesDetailsComponent implements OnInit {
  selectedCategory!: UpdateLanguagedto;

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
          this.selectedCategory = response.data;
        },
        (error) => {
          console.error('Error fetching language details:', error);
        }
      );
    }
  }
}
