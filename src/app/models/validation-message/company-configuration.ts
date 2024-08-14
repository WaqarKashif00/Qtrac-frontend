export const CompanyConfigurationMessages = {
  CompanynameMessages: [
    { type: 'required', message: 'Company name is required.' },
    { type: 'isExists', message: 'Company with same name already exists.'}
  ],
  AddressMessages: [
    {type: 'required', message: 'Street Address is required.'},
    {type: 'mismatched', message: 'Please select Street address from search results.'}
  ],
  PhoneNoMessages: [
     { type: 'required', message: 'Phone number is required.'},
     { type: 'pattern', message: 'Phone number is invalid.'},
     { type: 'maxlength', message: 'Phone number length has exceeded.'}
  ],
  SupportedLanguageMessages: [
    {type: 'required', message: 'Supported Languages is required.'}
  ],
  DefaultLanguageMessages: [
    {type: 'required', message: 'Default Language is required.'}
  ],
  OfficePhoneNoMessages: [
    { type: 'pattern', message: 'Office phone number is invalid.'}
 ],
 CellPhoneNoMessages: [
  { type: 'pattern', message: 'Cell phone Number is invalid.'}
],
  CountryMessages: [
    { type: 'required', message: 'Country is required.'}
 ],
  StateMessages: [
    { type: 'required', message: 'State is required.'}
 ],
  CityMessages: [
  { type: 'required', message: 'City is required.'}
 ],
 UsernameMessages: [
  { type: 'required', message: 'Please enter email address.'},
  { type: 'pattern', message: ' Email is invalid.' },
 ],
 APIkeyMessages: [
  { type: 'required', message: 'Please enter API key.'},
 ],
 PasswordMessages: [
  { type: 'required', message: 'Please enter password.'},
 ],
 displayNameMessage: [
  { type: 'required', message: 'Display Name is required.'}
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
 ],
 SMTPServerMessages: [
  {type: 'required', message: 'SMTP server is required.'},
  {type: 'pattern', message: 'Please enter valid SMTP server.'}
],
 PortMessages: [
  {type: 'required', message: 'Port is required.'},
  {type: 'pattern', message: 'Please enter valid port.'}
],
DataRetentionMessages: [
  {type: 'required', message: 'Retention years is required.'}
],
PurgeSensitiveMessages: [
  {type: 'required', message: 'Please enter valid time.'}
],
ServiceProviderMessages: [
  {type: 'required', message: 'Please select service provider.'}
],
EncryptionMessages: [
  {type: 'required', message: 'Please select encryption.'}
],
ClientIdMessages: [
  {type: 'required', message: 'Client id is required.'}
],
ClientSecretMessages: [
  {type: 'required', message: 'Client secret is required.'}
],
RefreshTokenMessages: [
  {type: 'required', message: 'Refresh token is required.'}
],

};
