export const UserMessages = {
  FirstNameMessages: [
    { type: 'required', message: 'Please enter first name.' }
  ],
  LastNameMessages: [
    { type: 'required', message: 'Please enter last name.' }
  ],
  PasswordMessages: [
    { type: 'required', message: 'Please enter password.' },
    { type: 'pattern', message: 'Password must match password policy.'},
  ],
  EmailMessages: [
    { type: 'pattern', message: ' Email is invalid.' },
    {type: 'required', message: 'Please enter email address.'},
    {type: 'isExists', message: 'This email address is already being used.'}
  ],
  PhoneNoMessages: [
    { type: 'pattern', message: 'Phone number is invalid.' },
    {type: 'required', message: 'Please enter phone number.'},
    {type: 'isExists', message: 'This phone number is already being used.'}
  ],
  RoleMessages: [
    { type: 'required', message: 'Please select a role.' }
  ],
   BranchesMessages: [
    {type: 'required', message: 'Please select locations or tags.'}
  ],
  typeMessages: [
    {type: 'required', message: 'Please select a type.'}
  ],
  companyMessages: [
    {type: 'required', message: 'Please select a company.'}
  ],
  TemplateMessages: [
    { type: 'required', message: 'Please select a template.' }
  ],
  QueueMessages: [
    { type: 'required', message: 'Please select a queue.' }
  ]
};
