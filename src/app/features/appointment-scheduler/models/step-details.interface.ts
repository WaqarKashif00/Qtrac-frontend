export interface IStepDetails {
  isLinear: boolean;
  steps: {
    id: string;
    label: string;
    pageName: string[];
    isValid: boolean;
    stepDescription: string;
    isVisited: boolean;
    isDefaultSelected: boolean
  }[];
}
