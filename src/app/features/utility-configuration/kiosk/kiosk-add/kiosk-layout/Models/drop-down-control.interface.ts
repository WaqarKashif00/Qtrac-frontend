import { Control } from './controls/control';

export interface DDLControl {
  Control: Control;
  ShowPropertyWindow: boolean;
  IsLabelControl: boolean;
  IsImageControl: boolean;
  IsVideoControl: boolean;
  IsSliderControl: boolean;
}
