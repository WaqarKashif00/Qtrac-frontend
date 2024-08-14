import { Injectable } from '@angular/core';
import { BrowserStorageService } from './browser-storage.service';

@Injectable({ providedIn: 'root' })
export class TokenStateService {

  private accessToken: string;
  private refreshToken: string;
  private idToken: string;

  public get AccessToken(): string {
    return this.accessToken;
  }
  private SetAccessToken(value: string) {
    this.accessToken = value;
  }

  public get RefreshToken(): string {
    return this.refreshToken;
  }
  private SetRefreshToken(value: string) {
    this.refreshToken = value;
  }

  public get IdToken(): string {
    return this.idToken;
  }
  private SetIdToken(value: string) {
    this.idToken = value;
  }

  constructor(private browserStorageService: BrowserStorageService) {
    this.Reload();
  }

  private Reload() {
    this.UpdateStateVariables();
  }

  public UpdateStateVariables() {
    this.SetAccessToken(this.browserStorageService.AccessToken);
    this.SetRefreshToken(this.browserStorageService.RefreshToken);
    this.SetIdToken(this.browserStorageService.IdToken);
  }

  public RemoveStateVariables() {
    this.SetAccessToken(null);
    this.SetRefreshToken(null);
    this.SetIdToken(null);
  }

}
