import { ElementRef, HostBinding, Component, Input, OnChanges } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'lavi-smooth-height',
  template: `
    <ng-content></ng-content>
  `,
  styles: [`
    :host {
      display: block;
      overflow: hidden;
    }
  `],
  animations: [
    trigger('grow', [
      transition('void <=> *', []),
      transition('* <=> *', [
        style({ height: '{{startHeight}}px', opacity: 0 }),
        animate('.8s ease'),
      ], { params: { startHeight: 0 } })
    ])
  ]
})
export class SmoothHeightComponent implements OnChanges {
  @Input() Trigger: any;

  StartHeight: number;

  @HostBinding('@grow') grow: any;

  constructor(private element: ElementRef) {

  }

  ngOnChanges() {
    this.StartHeight = this.element.nativeElement.clientHeight;

    this.grow = {
      value: this.Trigger,
      params: { startHeight: this.StartHeight }
    };
  }
}
