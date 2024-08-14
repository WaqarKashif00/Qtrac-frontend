export const CompanyMessages = {
    CompanynameMessages: [
      { type: 'required', message: 'Company name is required.' },
      { type: 'isExists', message: 'Company with same name already exists.'}
    ],
    AddressMessages: [
      {type: 'required', message: 'Street address is required.'}
    ],
    PhoneNoMessages: [
       { type: 'required', message: 'Phone number is required.'},
       { type: 'maxlength', message: 'Phone number length has exceeded.'}
    ],
    SupportedLanguageMessages: [
      {type: 'required', message: 'Supported Languages is required.'}
    ],
    OfficePhoneNoMessages: [
      { type: 'pattern', message: 'Office phone Number is invalid.'}
   ],
   CellPhoneNoMessages: [
    { type: 'pattern', message: 'Cell phone Number is invalid.'}
  ],
    CountryeMessages: [
      { type: 'required', message: 'Country is required.'}
   ],
    StateMessages: [
      { type: 'required', message: 'State is required.'}
   ],
    CityMessages: [
    { type: 'required', message: 'City is required.'}
   ],
   UsernameMessages: [
    { type: 'pattern', message: ' Email is invalid.' },
   ],
   UrlMessages: [
     {type: 'required', message: 'Url is required.'},
     {type: 'pattern', message: 'Please enter valid url.'}
   ],
   ZipMessages: [
     {type: 'required', message: 'Zip is required.'},
     {type: 'pattern', message: 'Please enter valid zip.'}
   ],
   ImageMessages: [
    { type: 'required', message: 'Please upload photo.' },
    { type: 'requiredFileSize', message: 'Image size exceeds maximum limit 4 MB.' },
    { type: 'requiredFileType', message: 'Upload only .png, .jpg, .jpeg file.' }
  ],
  NumberMessage: [
    {type: 'pattern', message: 'Please enter number.'}
  ],
  FirstNameMessages: [
    {type: 'required', message: 'Please enter first name.'}
  ],
  LastNameMessages: [
    {type: 'required', message: 'Please enter last name.'}
  ],
  EmailMessages: [
    { type: 'pattern', message: ' Email is invalid.' },
   ]


  };
