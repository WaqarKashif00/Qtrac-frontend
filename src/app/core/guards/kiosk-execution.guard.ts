import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { KioskShutDownResponse } from '../../models/common/kiosk-shutdown-response.interface';
import { DeviceStatus } from '../../models/enums/device-status.enum';
import { KioskType } from '../../models/enums/kiosk-type.enum';
import { KioskAPIService } from '../../shared/api-services/kiosk-api.service';
import { BrowserStorageService } from '../services/browser-storage.service';
import { RouteHandlerService } from '../services/route-handler.service';
import * as Sentry from "@sentry/angular"


@Injectable({ providedIn: 'root' })
export class KioskExecutionGuard implements CanActivate, CanActivateChild {

  constructor(
    private readonly browserStorageService: BrowserStorageService,
    private readonly routeHandlerService: RouteHandlerService,
    private readonly kioskAPIService: KioskAPIService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.IsValidRedirect(state);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    return this.IsValidRedirect(state);
  }

  private IsValidRedirect({ url }: { url: string }): Observable<boolean> | boolean {
    const token = this.browserStorageService.kioskExecutionToken;
    if (this.IsInvalidToken(token)) {
      this.RemoveAllDataAndRedirectToRegistrationPage();
      return false;
    }

    // const { branchId, browserId, companyId, kioskId } = new JwtHelperService().decodeToken(token);
    const  browserId = JSON.parse(this.browserStorageService.kioskExecutionToken).browserId;
    const  branchId = JSON.parse(this.browserStorageService.kioskExecutionToken).branchId;
    const  companyId = JSON.parse(this.browserStorageService.kioskExecutionToken).companyId;
    const  kioskId = JSON.parse(this.browserStorageService.kioskExecutionToken).kioskId;
    return this.kioskAPIService.GetShutDownDetails(branchId, browserId, { companyId, kioskId }).pipe(map((kioskShutDownDetails: KioskShutDownResponse) => {
      this.browserStorageService.SetKioskShutDownDetails(JSON.stringify(kioskShutDownDetails));

      if (!kioskShutDownDetails) {
        this.RemoveAllDataAndRedirectToRegistrationPage();
        this.browserStorageService.SetDeRegisterSource('noKioskShutdownDetails')
        return false;
      }

      if (kioskShutDownDetails.status === DeviceStatus.NotRegistered) {
        this.RemoveAllDataAndRedirectToRegistrationPage();
        this.browserStorageService.SetDeRegisterSource('kioskShutDownStatus=NotRegistered')

        return false;
      }

      const kioskType = JSON.parse(this.browserStorageService.kioskExecutionToken).kioskType;
      if (kioskType === KioskType.Kiosk) {

        const kioskExecutionComponentRoutePath = '/kiosk-execution';
        if (url.includes(kioskExecutionComponentRoutePath)) {
          return true;
        }
        this.routeHandlerService.RedirectToKioskExecutionPage();
        return false;
      }

      if (kioskType === KioskType.Monitor) {

        const MonitorExecutionComponentRoutePath = '/monitor-execution';
        if (url.includes(MonitorExecutionComponentRoutePath)) {
          return true;
        }
        this.routeHandlerService.RedirectToMonitorExecutionPage();
        return false;
      }

      return true;
    }), catchError((error) => {
      this.browserStorageService.SetDeRegisterSource('hit catchError')
      Sentry.captureException(error);
      this.RemoveAllDataAndRedirectToRegistrationPage();
      return of(false);
    }));
  }

  private RemoveAllDataAndRedirectToRegistrationPage() {

    this.browserStorageService.RemoveKioskExecutionToken();
    this.browserStorageService.RemoveKioskShutDownDetails();
    this.routeHandlerService.RedirectToKioskRegistrationPage();
  }

  private IsInvalidToken(token: string): boolean {
    return false;
  }

  private IsTokenExpired(token: string): boolean {
    return false;
  }
}
