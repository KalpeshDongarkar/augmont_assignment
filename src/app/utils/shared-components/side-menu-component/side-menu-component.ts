import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inner-side-menu-component',
  imports: [RouterLink],
  template: `
    <ul class="p-0" style="list-style: none;">
      @for (item of chldSideMenu; track item) {
      <li class="nav-item" (click)="item.chldFtrFlag = item.chldFtrFlag ? false : true">
        <a class="nav-link" [routerLink]="typeArr.includes(item.mtype) ? item.mRouteLink : null">
          <i class="menu-icon typcn typcn-document-text"></i>
          <span class="menu-title">{{ item.mLabel }}</span>
          @if(item?.chldFeature){
          <i class="menu-arrow"></i>
          }
        </a>
      </li>
      @if(item?.chldFtrFlag){ @if(item?.chldFeature){
      <ul>
        <app-inner-side-menu-component
          [chldSideMenu]="item?.chldFeature"
        ></app-inner-side-menu-component>
      </ul>
      } } }
    </ul>
  `,
  styleUrl: './side-menu-component.scss',
})

export class InnerSideMenuComponent {
  @Input() chldSideMenu: any[] = [];
  typeArr: any[] = ['MOFETR', 'FETR'];
}

@Component({
  selector: 'app-side-menu-component',
  imports: [InnerSideMenuComponent],
  templateUrl: './side-menu-component.html',
  styleUrl: './side-menu-component.scss',
})
export class SideMenuComponent {
  sideMenu: any[] = [
    {
      mLabel: 'Dashboard & Reports',
      mtype: 'MOFETR',
      iconClass: '',
      mRouteLink: '/main-app/dashboard',
    },
    {
      mLabel: 'Product',
      mtype: 'MO',
      iconClass: '',
      chldFtrFlag: false,
      chldFeature: [
        {
          mLabel: 'Product',
          mtype: 'FETR',
          mRouteLink: '/main-app/product/product-collection',
          iconClass: '',
        },
        {
          mLabel: 'Categories',
          mtype: 'FETR',
          mRouteLink: '/main-app/product/category-collection',
          iconClass: '',
        },
      ],
    },
  ];
}
