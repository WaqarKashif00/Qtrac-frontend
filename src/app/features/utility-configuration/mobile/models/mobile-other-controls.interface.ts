import { ImageControl } from './controls/image.control';
import { LabelControl } from './controls/label.control';
import { VideoControl } from './controls/video.control';
import { SliderControl } from './controls/slider.control';
import { IOtherControlDDL } from './other-control-drop-down.interface';

export interface IMobileOtherControls {
  labels: Array<LabelControl>;
  images: Array<ImageControl>;
  videos: Array<VideoControl>;
  sliders: Array<SliderControl>;
  otherControlList: Array<IOtherControlDDL>;
}
