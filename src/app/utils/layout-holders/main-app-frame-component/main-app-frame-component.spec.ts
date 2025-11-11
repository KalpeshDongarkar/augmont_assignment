import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainAppFrameComponent } from './main-app-frame-component';

describe('MainAppFrameComponent', () => {
  let component: MainAppFrameComponent;
  let fixture: ComponentFixture<MainAppFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainAppFrameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainAppFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
