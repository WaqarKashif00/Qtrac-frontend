import { Directive, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Styles } from './styles';

@Directive()
export class Control implements OnInit, OnDestroy{
  styles: Styles;
  form: FormGroup;
  name: string;
  subscription: Subscription;
  constructor() {
    this.styles = new Styles();
  }
  ngOnDestroy(): void {
    this.Destroy();
  }
  Destroy() {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.Init();
  }
  Init() {
  }
}
