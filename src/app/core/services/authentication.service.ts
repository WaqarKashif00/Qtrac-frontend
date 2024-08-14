import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { PkceService } from 'src/app/features/login/pkce.service';
import { AuthState } from 'src/app/models/common/auth-state.type';
import { TokenResponse } from 'src/app/models/common/token-response.type';
import { Validations } from 'src/app/models/constants/validation.constant';
import { UserRoleAPIService } from 'src/app/shared/api-services/user-role-api.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService extends AbstractComponentService {
  LoginForm: FormGroup;
  private readonly tenant = this.appConfigService.config.AADConfig.Tenant;
  private readonly signInPolicy =
    this.appConfigService.config.AADConfig.SignInPolicy;
  private readonly passwordResetPolicy =
    this.appConfigService.config.AADConfig.PasswordResetPolicy;
  private readonly passwordChangePolicy =
    this.appConfigService.config.AADConfig.PasswordChangePolicy;
  private readonly clientId = this.appConfigService.config.AADConfig.ClientId;

  private get redirectUrl() {
    return window.location.origin + '/auth';
  }

  constructor(
    private readonly pkceService: PkceService,
    private httpClient: HttpClient,
    private userRoleAPIService: UserRoleAPIService
  ) {
    super();
  }

  public SetForm() {
    this.LoginForm = this.formBuilder.group({
      email: [
        '',
      ],
    });
  }
  public SetValidator(){
    this.LoginForm.get("email").setValidators([Validators.required, Validators.pattern(Validations.EmailRegX)]);
    this.LoginForm.get("email").updateValueAndValidity();
   }

  getAuthorizeUrl(login: string): Promise<string> {
    if (!login) {
      throw new Error('Login is required');
    }
    return this._getAuthorizeUrl(this.signInPolicy, login);
  }

  getPasswordResetUrl(): Promise<string> {
    return this._getAuthorizeUrl(this.passwordResetPolicy);
  }

  getPasswordChangeUrl(): Promise<string> {
    return this._getAuthorizeUrl(this.passwordChangePolicy);
  }

  private async _getAuthorizeUrl(
    policy: string,
    login?: string
  ): Promise<string> {
    const challenge = await this.pkceService.generate();
    const codeChallenge = challenge.challenge;
    const state = challenge.state;

    const authState: AuthState = {
      policy,
      verifier: challenge.verifier,
    };

    this.browserStorageService.SetAdAuthState(state, authState);

    const baseUrl = this._getUrl(policy, 'authorize');

    let params = new HttpParams()
      .set('client_id', this.clientId)
      .set('redirect_uri', encodeURI(this.redirectUrl))
      .set('scope', `${this.clientId} offline_access`)
      .set('response_type', 'code')
      .set('prompt', 'login')
      .set('response_mode', 'query')
      .set('code_challenge_method', 'S256')
      .set('code_challenge', codeChallenge)
      .set('state', state);

    if (login) {
      params = params.set('login_hint', login);
    }

    return `${baseUrl}?${params.toString()}`;
  }

  async getToken(code: string, state: string): Promise<TokenResponse> {
    if (!code) {
      throw new Error('Code parameter is required');
    }
    if (!state) {
      throw new Error('State parameter is required');
    }
    const authStateValue = this.browserStorageService.GetAdAuthState(state);
    if (!authStateValue) {
      throw new Error(`State "${state}" was not found`);
    }
    this.browserStorageService.RemoveAdAuthState(state);

    const authState: AuthState = JSON.parse(authStateValue);

    const url = this._getUrl(authState.policy, 'token');
    const params = new HttpParams()
      .set('client_id', this.clientId)
      .set('grant_type', 'authorization_code')
      .set('scope', `${this.clientId} offline_access`)
      .set('redirect_uri', encodeURI(this.redirectUrl))
      .set('code_verifier', authState.verifier)
      .set('code', code);

    try {
      return await this.httpClient
        .post<TokenResponse>(url, params, {
          headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
        })
        .toPromise();
    } catch (error) {
      throw new Error(`${error.error.error}: ${error.error.error_description}`);
    }
  }

  private _getUrl(policy: string, endpoint: string): string {
    return `https://${this.tenant}.b2clogin.com/${this.tenant}.onmicrosoft.com/${policy}/oauth2/v2.0/${endpoint}`;
  }


}
