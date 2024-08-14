
export const HoursOfOperationMessage = {
  TemplateMessage: [
    { type: 'required',  message: 'Please enter template name.' },
    { type: 'isExists', message: 'Template with same name already exists.'}
  ],
  TimeMessages: [
    {type: 'required', message: 'Please enter time.'}
  ],
  DescriptionMessages: [
    {type: 'required', message: 'Please enter description.'}
  ],
  DateMessages: [
    {type: 'required', message: 'Please enter date.'}
  ],
  timeZoneMessage: [
    {type: 'required' , message: 'Please select time-zone'}
  ]
};
