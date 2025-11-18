import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryCollection } from './category-collection';

describe('CategoryCollection', () => {
  let component: CategoryCollection;
  let fixture: ComponentFixture<CategoryCollection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryCollection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryCollection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
