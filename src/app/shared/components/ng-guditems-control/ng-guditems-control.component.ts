import { Component, OnInit, ViewChild, Input, AfterContentInit, AfterViewInit } from '@angular/core';
import { NgVForContainerDirective } from '../../directives/virtual/ng-for-container.directive';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'nggud-items-control',
  templateUrl: './ng-guditems-control.component.html',
  styleUrls: ['./ng-guditems-control.component.css']
})
export class NgGUDItemsControlComponent implements OnInit, AfterViewInit {
  private _target;

  @ViewChild(NgVForContainerDirective) _container: NgVForContainerDirective;

  @Input() scrollTop: Number = 0;
  @Input() scrollbarWidth: number;
  @Input() scrollbarHeight: number;
  @Input() customSize: Function = null;

  constructor() { }

  ngOnInit() {
  }


  public attach(target) {
      this._target = target;
  }

  ngAfterViewInit() {
    if (this._container) {
      console.log('got container');
      this._container.attachUpdate(this._target);
    }
  }
}
