
export const LoginMessages = {
  PasswordMessages: [
    { type: 'required', message: 'Please enter password.' },
    { type: 'pattern', message: 'Please enter valid password.' },
    { type: 'minLength', message: 'Password must be atleast 6 characters.'}
  ],
  UserNameMessages: [
    { type: 'required', message: 'Please enter email.' },
    { type: 'pattern', message: ' Email is invalid.'},
    { type: 'emailExists', message: 'User does not exist.'}
  ]
};
