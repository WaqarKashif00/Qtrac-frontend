import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Snap2Component } from './snap2.component';

describe('Snap2.0Component', () => {
  let component: Snap2Component;
  let fixture: ComponentFixture<Snap2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Snap2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Snap2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
