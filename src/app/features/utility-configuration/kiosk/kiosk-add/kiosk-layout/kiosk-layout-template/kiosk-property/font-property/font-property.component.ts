import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  FontFamilies,
  FontStyles,
  FontWeights,
} from 'src/app/models/constants/font.constant';
@Component({
  selector: 'lavi-font',
  templateUrl: './font-property.component.html',
})
export class FontComponent {
  FontFamily: Array<string> = FontFamilies;
  FontWeight = FontWeights;
  FontStyle: Array<string> = FontStyles;
  @Input() FormGroup: FormGroup;
}
