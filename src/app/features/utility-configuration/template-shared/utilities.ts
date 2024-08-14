import { QuestionType } from '../../../models/enums/question-type.enum';

const  ControlType = [
  QuestionType.DropDown.value,
  QuestionType.MultiSelect.value,
  QuestionType.Options.value,
  ];

export function GetDefaultOrSelectedGlobalQuestionLanguageItem(item, selectedLanguageCode: string,
                                                               defaultLanguageCode: string, workFlowQuestions, isKiosk = true, panel?){
  const questionId = (isKiosk ? item.questionId : item.itemId);
  if (workFlowQuestions.find((m) => m.id === questionId)) {
    const type = workFlowQuestions.find((m) => m.id === questionId).type;
    const itemTypeSettings = [];
    if (ControlType.some((questionType) => questionType === type)) {
      workFlowQuestions
        .find((m) => m.id === questionId)
        .typeSetting.forEach((element) => {
          itemTypeSettings.push(
            GetElementWithSpecificSelectedOrDefaultLanguage(element, selectedLanguageCode, defaultLanguageCode)
              ?.option
          );
        });
    }
    return GetItem(item, workFlowQuestions, type, selectedLanguageCode, defaultLanguageCode, itemTypeSettings, isKiosk, panel);
}
}

export function GetDefaultOrSelectedServiceQuestionLanguageItem(item, selectedLanguageCode: string,
                                                                defaultLanguageCode: string, workFlowQuestions, isKiosk = true, panel?){
      const questionId = (isKiosk ? item.questionId : item.itemId);
      const questions = workFlowQuestions.questions;
      const type = questions.find((m) => m.id === questionId).type;
      const itemTypeSettings = [];
      if (ControlType.some((questionType) => questionType === type)) {
        questions
      .find((m) => m.id === questionId)
      .typeSetting.forEach((element) => {
      itemTypeSettings.push(
      GetElementWithSpecificSelectedOrDefaultLanguage(element, selectedLanguageCode, defaultLanguageCode)
      ?.option
      );
      });
      }
      return GetItem(item, questions, type, selectedLanguageCode, defaultLanguageCode, itemTypeSettings, isKiosk, panel);
}

function GetItem(item: any, questions: any, type: any, selectedLanguageCode: string, defaultLanguageCode: string,
                 itemTypeSettings: any[], isKiosk: boolean, panel) {
  const questionId = (isKiosk ? item.questionId : item.itemId);
  return {
    backgroundColor: item?.styles?.backgroundColor,
    color: isKiosk ? panel.styles.color : item.styles.color,
    font: isKiosk ? panel.styles.font : item.styles.font,
    fontSize: isKiosk ? panel.styles.fontSize : item.styles.fontSize,
    fontStyle: isKiosk ? panel.styles.fontStyle : item.styles.fontStyle,
    fontWeight: isKiosk ? panel.styles.fontWeight : item.styles.fontWeight,
    itemId: questions.find((m) => m.id === questionId).id,
    selected: questions.find((m) => m.id === questionId)
      .isVisible,
    itemType: type,
    itemText: GetElementWithSpecificSelectedOrDefaultLanguage(questions
      .find((m) => m.id === questionId)
      .question, selectedLanguageCode, defaultLanguageCode)?.question,
    itemTypeSetting: ControlType.some((questionType) => questionType === type)
      ? itemTypeSettings
      : questions.find((m) => m.id === questionId)
        .typeSetting,
  };
}

function GetElementWithSpecificSelectedOrDefaultLanguage(element: any, selectedLanguageCode: string, defaultLanguageCode: string) {
  let currentElement = element.find(
    (lang) => lang.languageId === selectedLanguageCode
  );
  if (!currentElement) {
    currentElement = element.find(
      (lang) => lang.languageId === defaultLanguageCode
    );
  }
  return currentElement ? currentElement : [];
}

export function HideAppBtnIfAppNotExist(buttons, appointmentTemplates) {
  if (!appointmentTemplates) {
    appointmentTemplates = [];
  }
  let appointments = appointmentTemplates
    && appointmentTemplates.filter(x => !x.isDeleted);
  if (appointments && appointments.length === 0) {
    let index = buttons.findIndex(b => b.name === DefaultButtonsNames.AppointmentButtonName);
    if (index !== -1)
      buttons.splice(index, 1);
  }
  return buttons;
}


export const DefaultButtonsNames = {
  BackButtonName: 'Back Button',
  FinishButtonName: 'Finish Button',
  NextButtonName: 'Next Button',
  AppointmentButtonName: 'Appointment Button'
};
