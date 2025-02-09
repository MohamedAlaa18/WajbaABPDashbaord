import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsComponent } from 'src/app/shared/icons/icons.component';
import { GetUserListDto, WajbaUserDto } from '@proxy/dtos/wajba-users-contract';
import { WajbaUserService } from '@proxy/controllers';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [IconsComponent, CommonModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent implements OnInit {
  profiles: WajbaUserDto[] = [];
  selectedProfile = 0;
  searchQuery: string = '';

  // List of chat messages
  messages = [
    { text: 'Hello Mohamed. Thank you for contacting us. My name is Ali. How can I help you?', time: '02:40', isSender: false },
    { text: 'I need help with my order, it is delayed.', time: '02:42', isSender: true },
    // Add more messages as needed
  ];

  constructor(
    private wajbaUserService: WajbaUserService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    const defaultInput: GetUserListDto = {
      skipCount: 0,
      maxResultCount: undefined,
      fullName: this.searchQuery,
    };

    this.wajbaUserService.getWajbaUserByInput(defaultInput).subscribe({
      next: (response) => {
        console.log(response);
        this.profiles = response.items;
      },
      error: (err) => {
        console.error('Error loading users:', err);
      },
    });
  }

  // Toggle between profiles
  selectProfile(index: number): void {
    this.selectedProfile = index;
  }

  // Trigger image upload
  triggerImageUpload(): void {
    const fileInput = document.getElementById('uploadImage') as HTMLInputElement;
    fileInput.click();
  }

  // Handle image upload
  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Uploaded file:', file);
      // You can now handle the file (e.g., upload to server)
    }
  }

  searchAction(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value;
    this.loadUsers();
  }
}
