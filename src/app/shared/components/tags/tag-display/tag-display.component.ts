import { Component, Input, OnInit } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';

@Component({
  selector: 'lavi-tag-display',
  templateUrl: './tag-display.component.html',
  styleUrls: ['./tag-display.component.scss']
})
export class TagDisplayComponent extends AbstractComponent {
  @Input()
  get tags(): Array<any> {
    return this._tags;
  }
  set tags(value: Array<any>) {
    this._tags = value;
  }

  private _tags: Array<any> = [];

  public get hasTags(): boolean {
    return this.tags.length > 0;
  }
}
