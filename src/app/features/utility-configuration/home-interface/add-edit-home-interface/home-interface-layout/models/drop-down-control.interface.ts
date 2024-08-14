import { Control } from './controls/control';

export interface DDLControl {
  control: Control;
  showPropertyWindow: boolean;
  isLabelControl: boolean;
  isImageControl: boolean;
  isSliderControl: boolean;
  isVideoControl: boolean;
}
