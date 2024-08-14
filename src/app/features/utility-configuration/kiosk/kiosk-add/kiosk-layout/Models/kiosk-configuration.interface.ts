import { ImageControl } from './controls/image.control';
import { LabelControl } from './controls/label.control';
import { VideoControl } from './controls/video.control';
import { DDLControl } from './drop-down-control.interface';
import { SliderControl } from './controls/slider.control';

export interface IKioskConfiguration {
  labelDivs: Array<LabelControl>;
  imageDivs: Array<ImageControl>;
  videoDivs: Array<VideoControl>;
  slidersDivs: Array<SliderControl>;
  otherControls: Array<DDLControl>;
}
