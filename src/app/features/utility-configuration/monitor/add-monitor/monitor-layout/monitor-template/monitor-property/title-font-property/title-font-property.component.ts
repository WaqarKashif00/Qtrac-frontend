import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import {
  FontFamilies,
  FontStyles,
  FontWeights,
} from 'src/app/models/constants/font.constant';
@Component({
  selector: 'lavi-title-font',
  templateUrl: './title-font-property.component.html',
})
export class TitleFontComponent extends AbstractComponent {

  @Input() FormGroup: FormGroup;

  FontFamily: Array<string> = FontFamilies;
  FontWeight: Array<any> = FontWeights;
  FontStyle: Array<string> = FontStyles;
}
