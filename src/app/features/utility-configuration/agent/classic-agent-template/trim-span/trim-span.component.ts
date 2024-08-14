import { Component, Input } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';

@Component({
  selector: 'lavi-trimmed-span',
  templateUrl: './trim-span.component.html',
})
export class TrimmedSpanComponent extends AbstractComponent {

  @Input() Text: string;
  @Input() MaxLength: number;

  get TrimmedText(): string {
    return this.Text?.length > this?.MaxLength
      ? this.Text?.slice(0, this?.MaxLength - 3) + '...'
      : this.Text
      ;
  }

  constructor() {
    super();
    this.MaxLength = 20;
  }


}
