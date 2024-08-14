export class StepperPreviewDetails {
  header: string;
  descriptionList: StepperPreviewDetailsDescription[] = [];
  isReviewPage:boolean
}
export class StepperPreviewDetailsDescription {
  stepId: string;
  description: string;
  label: string;
  isDefaultSelected:boolean
}
