import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-custom-layout',
  standalone: true,
  imports: [RouterOutlet,SideBarComponent,HeaderComponent],
  templateUrl: './custom-layout.component.html',
  styleUrl: './custom-layout.component.scss'
})
export class CustomLayoutComponent {

}
