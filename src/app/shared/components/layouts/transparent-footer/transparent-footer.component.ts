import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';

@Component({
  selector: 'lavi-transparent-footer',
  templateUrl: './transparent-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransparentFooterComponent extends AbstractComponent {}
