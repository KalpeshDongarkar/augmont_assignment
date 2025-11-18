import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSingletonTable } from './shared-singleton-table';

describe('SharedSingletonTable', () => {
  let component: SharedSingletonTable;
  let fixture: ComponentFixture<SharedSingletonTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedSingletonTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedSingletonTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
