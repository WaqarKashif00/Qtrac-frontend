export const AddNewBranchMessages = {
  NameMessages: [
    { type: 'required', message: 'Location name is required.' },
    { type: 'isExists', message: 'Location with same name already exists.' },
  ],
  PhoneNoMessages: [
    { type: 'required', message: 'Phone number is required.' },
    { type: 'pattern', message: 'Phone number is invalid.' },
    { type: 'isExist', message: 'Contact with same cell phone already exist.' },
    { type: 'maxlength', message: 'Phone number length has exceeded.'}
  ],
  AddressMessages: [
    { type: 'required', message: 'Street Address is required.' },
    {
      type: 'mismatched',
      message: 'Please select Street address from search results.',
    },
  ],
  CountryMessages: [{ type: 'required', message: 'Country is required.' }],
  StateMessages: [{ type: 'required', message: 'State is required.' }],
  CityMessages: [{ type: 'required', message: 'City is required.' }],
  EmailMessages: [
    { type: 'pattern', message: ' Email is invalid.' },
    { type: 'isExist', message: 'Contact with same email id already exist.' },
  ],
  ZipMessages: [
    { type: 'required', message: 'Zip is required.' },
    { type: 'pattern', message: 'Please enter valid zip.' },
  ],
  ImageMessages: [
    { type: 'required', message: 'Please upload photo.' },
    {
      type: 'requiredFileSize',
      message: 'Image size exceeds maximum limit 4 MB.',
    },
    {
      type: 'requiredFileType',
      message: 'Upload only .png, .jpg, .jpeg file.',
    },
  ],
  FirstNameMessages: [
    { type: 'required', message: 'Please enter first name.' },
  ],
  LastNameMessages: [{ type: 'required', message: 'Please enter last name.' }],
  SMSKeywordMessages: [
    { type: 'required', message: 'Please enter SMS keyword.' },
  ],
  TitleMessages: [{ type: 'required', message: 'Please enter title.' }],
  TemplateNameMessages: [
    { type: 'required', message: 'Please select template.' },
  ],
  DeviceIdMessages: [
    { type: 'required', message: 'Please enter device id.' },
    { type: 'invalid', message: 'Device not found' },
    { type: 'valid', message: 'Device Found' },
  ],
  DeviceMessages: [{ type: 'required', message: 'Please enter message.' }],
  SupportedLanguagesMessages: [
    { type: 'required', message: 'Supported Languages is required.' },
  ],
  DefaultLanguageMessages: [
    { type: 'required', message: 'Default language is required.' },
  ],
  WorkflowMessages: [{ type: 'required', message: 'Workflow is required.' }],
  ServiceMessages: [{ type: 'required', message: 'Service is required.' }],
  TextToJoin: [{ type: 'required', message: 'Template is required.' }]
};
