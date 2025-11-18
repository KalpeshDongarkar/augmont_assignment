import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../../shared-components/header-component/header-component";
import { SideMenuComponent } from "../../shared-components/side-menu-component/side-menu-component";
import { FooterComponent } from "../../shared-components/footer-component/footer-component";

@Component({
  selector: 'app-main-app-frame-component',
  imports: [RouterOutlet, HeaderComponent, SideMenuComponent, FooterComponent],
  templateUrl: './main-app-frame-component.html',
  styleUrl: './main-app-frame-component.scss'
})
export class MainAppFrameComponent {

}
