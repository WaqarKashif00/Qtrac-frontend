import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IAuthorizationDetails } from 'src/app/models/common/authorization-details.model';
import { SubSink } from 'subsink';
import { BrowserStorageService } from './browser-storage.service';
import { MediatorService } from './mediator.service';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private subs = new SubSink();
  private email: string;
  private userId: string;
  private companyId: string;
  private companyName: string;
  private companyLogoURL: string;
  private userType: string;
  private userImage: string;
  private userRoleId: string;
  private authorizationDetails: IAuthorizationDetails;
  private companyLoginMode: string;
  private userFirstName: string;
  private userLastName: string;
  private roleName: string;

  public get Email(): string {
    return this.email;
  }

  private SetEmail(value: string) {
    this.email = value;
  }

  public get UserName(): string {
    return `${this.userFirstName} ${this.userLastName}`;
  }

  public get UserId(): string {
    return this.userId;
  }

  private SetUserId(value: string) {
    this.userId = value;
  }

  public get CompanyId(): string {
    return this.companyId;
  }
  public get CompanyLogoUrl(): string {
    return this.companyLogoURL;
  }
  public get CompanyName(): string {
    return this.companyName;
  }
  private SetCompanyId(value: string) {
    this.companyId = value;
  }
  private SetCompanyName(CurrentSelectedCompanyName: string) {
    this.companyName = CurrentSelectedCompanyName;
  }
  private SetCompanyLogoURL(CurrentSelectedCompanyLogoUrl: string) {
    this.companyLogoURL = CurrentSelectedCompanyLogoUrl;
  }
  public get UserType(): string {
    return this.userType;
  }

  private SetUserType(value: string) {
    this.userType = value;
  }

  public get UserImage(): string {
    return this.userImage;
  }

  private SetUserImage(value: string) {
    this.userImage = value;
  }

  public get UserRoleId(): string {
    return this.userRoleId;
  }

  private SetUserRoleId(value: string) {
    this.userRoleId = value;
  }

  private SetAuthorizationDetails(value: IAuthorizationDetails) {
    this.authorizationDetails = value;
  }

  public get AuthorizationDetails(): IAuthorizationDetails {
    return this.authorizationDetails;
  }

  public get CompanyLoginMode(): string {
    return this.companyLoginMode;
  }

  private SetCompanyLoginMode(value: string) {
    this.companyLoginMode = value;
  }

  public get UserFirstName(): string {
    return this.userFirstName;
  }

  private SetUserFirstName(value: string) {
    this.userFirstName = value;
  }

  public get UserLastName(): string {
    return this.userLastName;
  }

  private SetUserLastName(value: string) {
    this.userLastName = value;
  }

  public get RoleName(): string {
    return this.roleName;
  }

  private SetRoleName(value: string) {
    this.roleName = value;
  }

  constructor(
    private browserStorageService: BrowserStorageService,
    private mediatorService: MediatorService
  ) {
    this.GetAndSetCompanyId();
    this.GetAndSetUserInitialDetails();
    this.GetAndSetUserRoleActions();
    this.GetAndSetCompanyLoginMode();
    this.Reload();
  }
  GetAndSetUserRoleActions() {
    this.subs.sink = this.mediatorService.RoleActions$.subscribe((data) => {
      this.SetAuthorizationDetails(data);
    });
  }

  private Reload() {
    this.UpdateStateVariables();
  }

  private GetAndSetCompanyId() {
    this.subs.sink = this.mediatorService.CompanyId$.subscribe((id) => {
      this.SetCompanyId(id);
      this.SetCompanyName(
        this.browserStorageService.CurrentSelectedCompanyName
      );
      this.SetCompanyLogoURL(
        this.browserStorageService.CurrentSelectedCompanyLogoUrl
      );
    });
  }

  private GetAndSetUserInitialDetails() {
    this.subs.sink = this.mediatorService.InitialUserDetails$.subscribe(
      (userDetails) => {
        if (userDetails) {
          this.SetUserFirstName(userDetails.firstName);
          this.SetUserLastName(userDetails.lastName);
          this.SetUserType(userDetails.type);
          this.SetUserImage(userDetails.image);
          this.SetUserRoleId(userDetails.role);
          this.SetRoleName(userDetails.roleName);
          this.SetEmail(userDetails.email);
        }
      }
    );
  }

  private GetAndSetCompanyLoginMode() {
    this.subs.sink = this.mediatorService.CompanyLoginMode$.subscribe(
      (mode) => {
        this.SetCompanyLoginMode(mode);
      }
    );
  }

  public UpdateStateVariables() {
    const currentUserData = new JwtHelperService().decodeToken(
      this.browserStorageService.IdToken
    );
    if (currentUserData === null) {
      return;
    }
    this.SetUserId(currentUserData.sub);
    this.SetCompanyId(this.browserStorageService.CurrentSelectedCompanyId);
    this.SetCompanyName(this.browserStorageService.CurrentSelectedCompanyName);
    this.SetCompanyLogoURL(
      this.browserStorageService.CurrentSelectedCompanyLogoUrl
    );
  }

  public RemoveStateVariables() {
    this.SetEmail(null);
    this.SetUserId(null);
    this.SetUserFirstName(null);
    this.SetUserLastName(null);
    this.SetUserType(null);
    this.SetUserImage(null);
    this.SetCompanyId(null);
    this.SetCompanyLogoURL(null);
    this.SetUserImage(null);
    this.SetCompanyName(null);
    this.SetCompanyLoginMode(null);
    this.SetRoleName(null);
    this.subs.unsubscribe();
  }
}
