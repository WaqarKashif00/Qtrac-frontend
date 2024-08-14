import { Control } from './control';

export class ItemsControl extends Control {
  selectedLanguageId: string;
  itemId: string;
  itemsSetId: string;
  isSelected: boolean;
  isMobileSelected: boolean;
  required: boolean;
  visible: boolean;
  text: any;
  icon: object;
  constructor(
    text: any,
    itemId: string,
    itemSetId: string,
    required: boolean,
    visible: boolean,
    selected: boolean = true,
    icon: object
  ) {
    super();
    this.InitializeProperties(text, itemId, itemSetId, selected, required, visible, icon);
  }

  private InitializeProperties(
    text: any,
    questionId: string,
    questionSetId: string,
    selected: boolean,
    required: boolean,
    visible: boolean,
    icon: object
  ) {
    this.text = text;
    this.itemId = questionId;
    this.itemsSetId = questionSetId;
    this.visible = visible;
    this.required = required;
    this.selectedLanguageId = 'en';
    this.isMobileSelected = true;
    this.isSelected = selected;
    this.icon = icon;
  }
}
