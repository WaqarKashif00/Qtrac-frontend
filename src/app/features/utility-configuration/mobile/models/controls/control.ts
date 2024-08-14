import { FormGroup } from '@angular/forms';
import { Styles } from './styles';

export class Control {
  styles: Styles;
  form: FormGroup;
  name: string;
  constructor() {
    this.styles = new Styles();
  }
}
