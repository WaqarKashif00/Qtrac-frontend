export interface ISmtpSettings{
  serviceProvider: string;
  smtpServer: string;
  portNumber: number;
  username: string;
  password: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  sendGridAPIKey: string;
  displayName: string;
  encryption: string;
}
