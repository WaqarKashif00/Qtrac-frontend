import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TbauthComponent } from './tbauth.component';

describe('TbauthComponent', () => {
  let component: TbauthComponent;
  let fixture: ComponentFixture<TbauthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TbauthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TbauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
