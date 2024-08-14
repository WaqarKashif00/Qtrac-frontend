import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { OnChange } from 'src/app/shared/decorators/onchange.decorator';
import { DesignerPanel } from '../../models/controls/designer-panel.control';
import {
  StepperPreviewDetails,
  StepperPreviewDetailsDescription,
} from '../../models/controls/stepper-preview-details';

@Component({
  selector: 'lavi-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StepperComponent extends AbstractComponent {
  @Input('CurrentStep') CurrentStep: number;
  @Input('StepsDetails') StepsDetails;

  @OnChange('UpdateStepperColor')
  @Input('StepperColor')
  Color: DesignerPanel;
  @Input('StepperPreviewDetails') StepperPreview: StepperPreviewDetails = {
    descriptionList: [],
    header: '',
    isReviewPage: false,
  };

  @Output() OnStepSelected: EventEmitter<number> = new EventEmitter();

  constructor(public el: ElementRef) {
    super();
  }

  Init() {
    this.UpdateStepperColor();
  }

  UpdateStepperColor() {
    const stepperContainer =
      this.el.nativeElement.querySelector('.stepper-container');
    if (stepperContainer) {
      this.el.nativeElement
        .querySelector('.stepper-container')
        .style.setProperty('--activeback-color', this.Color.activeBackColor);
      this.el.nativeElement
        .querySelector('.stepper-container')
        .style.setProperty(
          '--inactiveback-color',
          this.Color.inActiveTextColor
        );
      this.el.nativeElement
        .querySelector('.stepper-container')
        .style.setProperty('--activetext-color', this.Color.activeTextColor);
      this.el.nativeElement
        .querySelector('.stepper-container')
        .style.setProperty(
          '--inactivetext-color',
          this.Color.inActiveBackColor
        );
    }
  }

  OnSelect(StepsDetails) {
    if (!StepsDetails.step.isVisited || StepsDetails.step.isDefaultSelected) {
      StepsDetails.preventDefault();
    } else {
      this.OnStepSelected.emit(StepsDetails.step.id);
    }
  }
  OnSectionCLick(id, isReviewPage,isDefaultSelected) {
    if (isReviewPage && !isDefaultSelected) {
      this.OnStepSelected.emit(id);
    }
  }
}
