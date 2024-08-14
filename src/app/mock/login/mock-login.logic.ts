import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ILoginRequest } from 'src/app/features/login/login-request.interface';
import { ILoginResponse } from 'src/app/features/login/login-response.interface';
import { HttpStatusCode } from 'src/app/models/enums/http-status-code.enum';
import { BaseMockLogic } from '../base-mock.logic';

// tslint:disable-next-line:no-namespace
export class MockLoginLogic extends BaseMockLogic {

public UserList: ILoginRequest[] =
  [
    {
      emailAddress: { email: 'jone@gmail.com' },
      password: { password: 'jone123' }
    },
    {
      emailAddress: { email: 'jack@gmail.com' },
      password: { password: 'jack@123' }
    },
    {
      emailAddress: { email: 'admin@gmail.com' },
      password: { password: 'admin@123' }
    },
  ];

  public Authenticate(request: ILoginRequest): HttpResponse<ILoginResponse> | HttpErrorResponse {
    if (request.emailAddress.email === 'admin@gmail.com' && request.password.password === 'admin@123') {
      const result: ILoginResponse = {
      AccessToken : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiYzY5NmNjOWEtOWNmYy00NWNhLWIzZmMtZGFkZjEyNDQ0NDZhIiwiZW1haWwiOiJhZG1pbkBvdmVyLWJsb2cuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImNvbXBhbnlpZCI6Ijc5NDgwNDM3LWRjYmEtNDIyMi04NTEwLTNlMTdmZTg5OTk1ZiJ9LCJpYXQiOjE1OTQ0ODQyMDgsImV4cCI6MTg5NDc4ODI2OH0.wTa5ATGpg55QGh4N7ocpTxqhWTfJ7xFOw2qQ-vpODnw',
      IdToken : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiYzY5NmNjOWEtOWNmYy00NWNhLWIzZmMtZGFkZjEyNDQ0NDZhIiwiZW1haWwiOiJhZG1pbkBvdmVyLWJsb2cuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImNvbXBhbnlJZCI6Ijc5NDgwNDM3LWRjYmEtNDIyMi04NTEwLTNlMTdmZTg5OTk1ZiJ9LCJpYXQiOjE1OTQ0ODQyMDgsImV4cCI6MTg5NDc4ODI2OH0.j6M8a2QaEc1bbhfPR5YHSInzzFjJIectNB2SeGV-XEs',
      RefreshToken : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiYzY5NmNjOWEtOWNmYy00NWNhLWIzZmMtZGFkZjEyNDQ0NDZhIiwiZW1haWwiOiJhZG1pbkBvdmVyLWJsb2cuY29tIiwidXNlcm5hbWUiOiJhZG1pbiIsImNvbXBhbnlJZCI6Ijc5NDgwNDM3LWRjYmEtNDIyMi04NTEwLTNlMTdmZTg5OTk1ZiJ9LCJpYXQiOjE1OTQ0ODQyMDgsImV4cCI6MTY5NzA3NjIwOH0.EdAcBaE-Kct6L6q26LNEG_VX8BM33PvCX4xkL-0z5tU',
      Errormessage: ''
    };
      return new HttpResponse<any>({
        status: HttpStatusCode.OK,
        body: result
      });
    }
    else {
      const result = {
        Errormessage: 'Incorrect Credentials'
      };
      return new HttpResponse<any>({
        status: HttpStatusCode.BadRequest,
        body: result
      });
      // throw new HttpErrorResponse({
      //   statusText:'User invalid',
      //   status: HttpStatusCode.BadRequest
      // });
    }
  }

  public ServerError(): HttpErrorResponse {
      throw new HttpErrorResponse({
        status: HttpStatusCode.ServerError
      });
  }

public CheckEmailExistOrNot(request): HttpResponse<Boolean> {
  const data = this.UserList.filter((data) => data.emailAddress.email === request.value.email);
  const isExist = data.length > 0 ? true : false;
  return new HttpResponse<any>({
    status: HttpStatusCode.OK,
    body: isExist
  });
}

}
