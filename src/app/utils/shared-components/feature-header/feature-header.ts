import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-feature-header',
  imports: [],
  templateUrl: './feature-header.html',
  styleUrl: './feature-header.scss',
})
export class FeatureHeader implements OnChanges {
  @Input() ftre_name: string = '';

  fetr_header: any = {
    'product-collection': {
      fetr_title: 'Products',
      fetr_subtitle:
        'Transforming ideas into impactful solutions through research, design, and innovation to build products that meet user needs and business goals.',
    },
    'category-collection': {
      fetr_title: 'Categories',
      fetr_subtitle:
        'Transforming ideas into impactful solutions through research, design, and innovation to build products that meet user needs and business goals.',
    },
  };

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {}
}
