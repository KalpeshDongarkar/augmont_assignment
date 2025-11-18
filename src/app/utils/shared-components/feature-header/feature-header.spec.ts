import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureHeader } from './feature-header';

describe('FeatureHeader', () => {
  let component: FeatureHeader;
  let fixture: ComponentFixture<FeatureHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeatureHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
