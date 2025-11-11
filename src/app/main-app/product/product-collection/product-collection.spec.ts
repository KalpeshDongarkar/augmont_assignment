import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCollection } from './product-collection';

describe('ProductCollection', () => {
  let component: ProductCollection;
  let fixture: ComponentFixture<ProductCollection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCollection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCollection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
