import { CommonModule } from '@angular/common';
import { Component, Renderer2, ElementRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SidebarService } from 'src/app/services/Sidebar/sidebar.service';
import { AfterActionService } from 'src/app/services/after-action/after-action-service.service';
import { BranchService, LanguageService } from '@proxy/controllers';
import { IconsComponent } from 'src/app/shared/icons/icons.component';
import { BranchDto } from '@proxy/dtos/branch-contract';
import { WajbaUserDto } from '@proxy/dtos/wajba-users-contract';
import { LanguageDto } from '@proxy/dtos/languages';
import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, IconsComponent, NgbDropdownModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  isBranchDropdownOpen = false;
  isLanguageDropdownOpen = false;
  isProfileDesktopDropdownOpen = false;
  isProfileMobileDropdownOpen = false;
  isSidebarOpen = false;

  selectedBranch: string = 'Doha';
  token: string | null = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJnb2hlZDQ3MTM1QGRheXBleS5jb20iLCJqdGkiOiIwZDZkZmU4Ny02MzI2LTRhZTQtYjNmOC1jYTMyNDc4Y2ZmYjciLCJuYW1lIjoibW9oYW1lZCBhbGFhIiwiZW1haWwiOiJnb2hlZDQ3MTM1QGRheXBleS5jb20iLCJwaG9uZSI6IjAxMjg5NjQzMjQwIiwiY3VzdG9tZXJJZCI6IjJlN2Q2Mzc0LTUyZjctNDRkZS1iMDBiLTBjNmY0MjhmNjQ5YSIsImV4cCI6MTcyNTU1NDIxNSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3QifQ.8NGGoh6NoXPKg29wYyn8uhas3A1NB8jHC2Q8yYmYg5U';
  user!: WajbaUserDto;
  storedBranch!: BranchDto;
  branches: BranchDto[] = [];
  languages!: LanguageDto[];

  profileMenuItems = [
    { icon: 'edit', label: 'Edit profile', href: '#', src: "assets/images/edit-gray.svg" },
    { icon: 'change_password', label: 'Change password', href: '#', src: "assets/images/change-password.svg" },
    { icon: 'logout', label: 'Logout', href: '#', src: "assets/images/logout.svg" },
  ];

  selectedLanguage!: string;
  selectedLanguageImage!: string;

  private clickListener!: () => void;

  constructor(
    // private translateService: TranslateService,
    private renderer: Renderer2,
    private sidebarService: SidebarService,
    private elRef: ElementRef,
    private branchService: BranchService,
    private afterActionService: AfterActionService,
    private languageService: LanguageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const savedLanguage = localStorage.getItem('selectedLanguage');
      const savedLanguageImage = localStorage.getItem('selectedLanguageImage');
      const savedLanguageName = localStorage.getItem('selectedLanguageName');

      this.selectedLanguage = savedLanguageName || 'English';
      this.selectedLanguageImage = savedLanguageImage || '/assets/images/english.png';

      if (savedLanguage) {
        this.changeDirection(savedLanguage);
        // this.translateService.use(savedLanguage);
      }
    }
  }

  ngOnInit(): void {
    // this.tokenSubscription = this.jwtService.authToken$.subscribe(token => {
    //   this.token = token;
    //   this.updateUser();
    // });
    this.loadBranches();
    this.loadLanguages();

    this.sidebarService.getSidebarState().subscribe(isOpen => {
      this.isSidebarOpen = isOpen;
    });

    // console.log('this.token : ' + this.token);
    // this.updateUser();

    this.storedBranch = JSON.parse(localStorage.getItem('selectedBranch') || '{}');
    if (this.storedBranch)
      this.selectedBranch = this.storedBranch.name
  }

  ngAfterViewInit(): void {
    this.clickListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!this.elRef.nativeElement.contains(target)) {
        this.closeDropdowns();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
  }

  private closeDropdowns(): void {
    this.isBranchDropdownOpen = false;
    this.isLanguageDropdownOpen = false;
    this.isProfileDesktopDropdownOpen = false;
    this.isProfileMobileDropdownOpen = false;
  }

  selectBranch(branch: BranchDto) {
    this.selectedBranch = branch.name;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('selectedBranch', JSON.stringify(branch));
    }

    this.afterActionService.reloadCurrentRoute();
  }

  changeLanguage(event: any, language: string, image: string, name: string) {
    event.preventDefault();

    this.selectedLanguage = name;
    this.selectedLanguageImage = image;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('selectedLanguage', language);
      localStorage.setItem('selectedLanguageImage', image);
      localStorage.setItem('selectedLanguageName', name);
    }

    this.changeDirection(language);
    // this.translateService.use(language);
  }

  changeDirection(lang: string) {
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    this.renderer.setAttribute(document.documentElement, 'dir', direction);
  }

  toggleBranchDropdown() {
    this.isBranchDropdownOpen = !this.isBranchDropdownOpen;
    this.isLanguageDropdownOpen = false;
    this.isProfileDesktopDropdownOpen = false;
  }

  toggleLanguageDropdown() {
    this.isLanguageDropdownOpen = !this.isLanguageDropdownOpen;
    this.isBranchDropdownOpen = false;
    this.isProfileDesktopDropdownOpen = false;
  }

  toggleProfileDesktopDropdown() {
    this.isProfileDesktopDropdownOpen = !this.isProfileDesktopDropdownOpen;
    this.isBranchDropdownOpen = false;
    this.isLanguageDropdownOpen = false;
    this.isProfileMobileDropdownOpen = false;
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
    // console.log(this.isSidebarOpen);
  }

  // private updateUser(): void {
  //   if (this.token) {
  //     const userId = this.jwtService.getUserIdFromToken(this.token);
  //     if (userId) {
  //       this.userService.getCustomerById(userId).subscribe({
  //         next: (data: IUser) => {
  //           this.user = data;
  //           console.log('User data:', this.user);
  //         },
  //         error: (error) => {
  //           console.error('Failed to fetch user data', error);
  //         }
  //       });
  //     }
  //   } else {
  //     this.user = {} as IUser;
  //   }
  // }

  loadBranches() {
    const defaultInput: PagedAndSortedResultRequestDto = {
      sorting: '',
      skipCount: 0,
      maxResultCount: undefined
    };

    // const restaurantId = environment.RESTAURANT_ID;
    this.branchService.getList(defaultInput).subscribe({
      next: (response) => {
        // Filter branches where status is 1 (active)
        this.branches = response.data.items;
        console.log(response);

        // Check if storedBranch is empty, then set the first active branch
        if (Object.keys(this.storedBranch).length === 0 && this.branches.length > 0) {
          console.log("Branch : ", this.branches[0]);
          this.selectBranch(this.branches[0]);
        }
      },
      error: (error) => {
        console.error('Failed to fetch branches', error);
      }
    });
  }

  loadLanguages() {
    const defaultInput: PagedAndSortedResultRequestDto = {
      sorting: '',
      skipCount: 0,
      maxResultCount: undefined
    };

    this.languageService.getAllByDto(defaultInput).subscribe({
      next: (response) => {
        // this.languages = response.data.items;
        // this.selectedLanguage = this.languages[0]?.name;
        // this.selectedLanguageImage = this.languages[0]?.image;
        // console.log(response)
      },
      error: (error) => {
        console.error('Failed to fetch languages', error);
      }
    });
  }

  logout() {
    // this.userService.logout().subscribe({
    //   next: () => {
    //     // Session storage is cleared and authTokenSubject is updated automatically
    //     this.afterActionService.reloadCurrentRoute();
    //   },
    //   error: (error) => {
    //     console.error('Logout failed', error);
    //   }
    // });
  }
}
