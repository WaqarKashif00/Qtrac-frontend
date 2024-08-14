import { ImageControl } from './controls/image.control';
import { LabelControl } from './controls/label.control';
import { VideoControl } from './controls/video.control';
import { SliderControl } from './controls/slider.control';

export interface IConfiguration {
  labelDivs: Array<LabelControl>;
  imageDivs: Array<ImageControl>;
  videoDivs: Array<VideoControl>;
  sliderDivs: Array<SliderControl>;
}
