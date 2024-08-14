import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import {
  FontFamilies,
  FontStyles,
  FontWeights,
} from 'src/app/models/constants/font.constant';
@Component({
  selector: 'lavi-mobile-font',
  templateUrl: './mobile-font-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileFontComponent extends AbstractComponent {
  FontFamily: Array<string> = FontFamilies;
  FontWeight = FontWeights;
  FontStyle: Array<string> = FontStyles;
  @Input() FormGroup: FormGroup;
  @Input() FontMaxLength: Number = 2;
  @Input() ShowFontSize = true;
}
