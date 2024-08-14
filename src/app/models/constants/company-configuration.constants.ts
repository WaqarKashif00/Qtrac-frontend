export const DefaultCompanyConfigValues = {
  CountryListDefaultValue: { countryCode: null, country: 'Select Country' },
  StateListDefaultValue: { stateCode: null, state: 'Select State' },
  CityListDefaultValue: { cityCode: null, city: 'Select City', timeZone: null },
  DefaultLanguageValue: {
    languageCode: null,
    language: 'Select Default Language',
  },
  SupportedLanguageValue: [{ value: null, text: 'Supported Languages' }],
  EncryptionListDefaultValue: { value: null, text: 'Select Encryption' },
  TimeIntervalDefaultValue: { value: 'HR', text: 'Hours' },
  LoginModeDefaultValue: { value: 'INTERNAL', text: 'Internal Authentication' },
  SMTPServiceProviderDefaultValue: {
    value: null,
    text: 'Select Service provider',
  },
};

export const SMTPServiceProvider =  {
  SendGrid : { display:"Send Grid", value:"SEND_GRID" },
  Gmail : { display:"Gmail", value:"GMAIL" },
  GmailOAuth2: { display:"Gmail OAuth2", value:"GMAIL_OAUTH2" },
  GeneralSMTP : { display:"General SMTP", value:"GENERAL_SMTP" },
};

export const GMAIL_SMTP_SERVER = 'smtp.gmail.com';
export const SMTP_SETTINGS_SAVE_SUCCESS = 'SMTP settings updated.';

export const Encryptions = [
  { value: 'SHA', text: 'SHA' },
  { value: 'SSL', text: 'SSL' },
  { value: 'RSA', text: 'RSA' },
];

