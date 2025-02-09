import { Component } from '@angular/core';
import { PosLeftSideComponent } from "../pos-left-side/pos-left-side.component";
import { PosRightSideComponent } from "../pos-right-side/pos-right-side.component";

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [PosLeftSideComponent, PosRightSideComponent],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss'
})
export class POSComponent {

}

