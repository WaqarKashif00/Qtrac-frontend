import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[lavi-help-button-visibility]',
})
export class HelpButtonVisibilityDirective {
  @Input('lavi-help-button-visibility')
  set laviHelpButtonVisibility(value: boolean) {
    !value && document.getElementById('launcher').remove();
  }
}
