import { Injectable } from '@angular/core';
import { AbstractService } from 'src/app/base/abstract-service';
import { kioskData } from 'src/app/models/common/kiosk-data';
import { BrowserStorageKey } from 'src/app/models/constants/browser-storage-key.constant';
import * as Sentry from "@sentry/angular"

@Injectable({ providedIn: 'root' })
export class BrowserStorageService extends AbstractService {
  private ArrayOfNonRemovalBrowserStorageKey = [
    BrowserStorageKey.Error,
    BrowserStorageKey.kioskExecutionToken,
    BrowserStorageKey.KioskShutDownDetails,
  ];
  MonitorToken: any;

  public SetAccessToken(value: string) {
    localStorage.setItem(BrowserStorageKey.AccessToken, value);
  }
  public get AccessToken(): string {
    return localStorage.getItem(BrowserStorageKey.AccessToken);
  }

  public SetRefreshToken(value: string) {
    localStorage.setItem(BrowserStorageKey.RefreshToken, value);
  }

  public get RefreshToken(): string {
    return localStorage.getItem(BrowserStorageKey.RefreshToken);
  }

  public SetIdToken(value: string) {
    localStorage.setItem(BrowserStorageKey.IdToken, value);
  }

  public get IdToken(): string {
    return localStorage.getItem(BrowserStorageKey.IdToken);
  }

  public SetAppointmentVerificationToken(value: string) {
    localStorage.setItem(BrowserStorageKey.AppointmentVerificationToken, value);
  }

  public get AppointmentVerificationToken(): string {
    return localStorage.getItem(BrowserStorageKey.AppointmentVerificationToken);
  }

  public RemoveAppointmentVerificationToken() {
    sessionStorage.removeItem(BrowserStorageKey.AppointmentVerificationToken);
  }

  public SetUserId(value: string) {
    sessionStorage.setItem(BrowserStorageKey.UserId, value);
  }

  public get UserId(): string {
    return sessionStorage.getItem(BrowserStorageKey.UserId);
  }

  public RemoveUserId() {
    sessionStorage.removeItem(BrowserStorageKey.UserId);
  }

  public SetHoursOfOperationId(value: string) {
    sessionStorage.setItem(BrowserStorageKey.HoursOfOperationId, value);
  }

  public get HoursOfOperationId(): string {
    return sessionStorage.getItem(BrowserStorageKey.HoursOfOperationId);
  }

  public RemoveHoursOfOperationId(): void {
    sessionStorage.removeItem(BrowserStorageKey.HoursOfOperationId);
  }
  public SetSchedulerId(value: string) {
    sessionStorage.setItem(BrowserStorageKey.SchedulerId, value);
  }

  public get SchedulerId(): string {
    return sessionStorage.getItem(BrowserStorageKey.SchedulerId);
  }

  public RemoveSchedulerId() {
    sessionStorage.removeItem(BrowserStorageKey.SchedulerId);
  }

  public get SchedulerName(): string {
    return sessionStorage.getItem(BrowserStorageKey.SchedulerName);
  }
  public SetSchedulerName(value: string) {
    sessionStorage.setItem(BrowserStorageKey.SchedulerName, value);
  }
  public RemoveSchedulerName() {
    sessionStorage.removeItem(BrowserStorageKey.SchedulerName);
  }

  public get KioskTemplateName(): string {
    return sessionStorage.getItem(BrowserStorageKey.KioskTemplateName);
  }
  public SetKioskTemplateName(value: string) {
    sessionStorage.setItem(BrowserStorageKey.KioskTemplateName, value);
  }
  public RemoveKioskTemplateName() {
    sessionStorage.removeItem(BrowserStorageKey.KioskTemplateName);
  }

  public get MonitorTemplateName(): string {
    return sessionStorage.getItem(BrowserStorageKey.MonitorTemplateName);
  }
  public SetMonitorTemplateName(value: string) {
    sessionStorage.setItem(BrowserStorageKey.MonitorTemplateName, value);
  }
  public RemoveMonitorTemplateName() {
    sessionStorage.removeItem(BrowserStorageKey.MonitorTemplateName);
  }

  public get MobileInterfaceName(): string {
    return sessionStorage.getItem(BrowserStorageKey.MobileInterfaceName);
  }
  public SetMobileInterfaceName(value: string) {
    sessionStorage.setItem(BrowserStorageKey.MobileInterfaceName, value);
  }
  public RemoveMobileInterfaceName() {
    sessionStorage.removeItem(BrowserStorageKey.MobileInterfaceName);
  }

  public get HomeInterfaceName(): string {
    return sessionStorage.getItem(BrowserStorageKey.HomeInterfaceName);
  }
  public SetHomeInterfaceName(value: string) {
    sessionStorage.setItem(BrowserStorageKey.HomeInterfaceName, value);
  }
  public RemoveHomeInterfaceName() {
    sessionStorage.removeItem(BrowserStorageKey.HomeInterfaceName);
  }

  public SetAgentId(value: string) {
    sessionStorage.setItem(BrowserStorageKey.AgentId, value);
  }

  public get AgentId(): string {
    return sessionStorage.getItem(BrowserStorageKey.AgentId);
  }

  public RemoveAgentId() {
    sessionStorage.removeItem(BrowserStorageKey.AgentId);
  }

  public SetLogError(value: any) {
    localStorage.setItem(BrowserStorageKey.Error, JSON.stringify(value));
  }

  public SetBranchId(value: string) {
    sessionStorage.setItem(BrowserStorageKey.BranchId, value);
  }

  public get BranchId(): string {
    return sessionStorage.getItem(BrowserStorageKey.BranchId);
  }

  public RemoveBranchId(): void {
    sessionStorage.removeItem(BrowserStorageKey.BranchId);
  }

  public SetCompanyId(value: string) {
    sessionStorage.setItem(BrowserStorageKey.CompanyId, value);
  }
  public get CompanyId(): string {
    return sessionStorage.getItem(BrowserStorageKey.CompanyId);
  }
  public RemoveCompanyId(): void {
    sessionStorage.removeItem(BrowserStorageKey.CompanyId);
  }

  public SetWorkFlowId(value: string) {
    sessionStorage.setItem(BrowserStorageKey.WorkflowId, value);
  }

  public get WorkFlowId(): string {
    return sessionStorage.getItem(BrowserStorageKey.WorkflowId);
  }

  public RemoveWorkFlowId(): void {
    sessionStorage.removeItem(BrowserStorageKey.WorkflowId);
  }

  public SetCurrentSelectedCompanyId(value: string) {
    localStorage.setItem(BrowserStorageKey.CurrentSelectedCompanyId, value);
  }

  public get CurrentSelectedCompanyId(): string {
    return localStorage.getItem(BrowserStorageKey.CurrentSelectedCompanyId);
  }

  public RemoveCurrentSelectedCompanyId(): void {
    localStorage.removeItem(BrowserStorageKey.CurrentSelectedCompanyId);
  }
  public SetCurrentSelectedCompanyName(value: string) {
    localStorage.setItem(BrowserStorageKey.CurrentSelectedCompanyName, value);
  }

  public get CurrentSelectedCompanyName(): string {
    return localStorage.getItem(BrowserStorageKey.CurrentSelectedCompanyName);
  }

  public RemoveCurrentSelectedCompanyLogoUrl(): void {
    localStorage.removeItem(BrowserStorageKey.CurrentSelectedCompanyLogoUrl);
  }
  public SetCurrentSelectedCompanyLogoUrl(value: string) {
    localStorage.setItem(BrowserStorageKey.CurrentSelectedCompanyLogoUrl, value);
  }

  public get CurrentSelectedCompanyLogoUrl(): string {
    return localStorage.getItem(BrowserStorageKey.CurrentSelectedCompanyLogoUrl);
  }

  public RemoveCurrentSelectedCompanyName(): void {
    localStorage.removeItem(BrowserStorageKey.CurrentSelectedCompanyName);
  }


  public SetDeRegisterSource(value: string) {
    localStorage.setItem(BrowserStorageKey.DeRegisterSource, value);
    Sentry.captureException(value);
  }

  public RemoveDeRegisterSource(): void {
    localStorage.removeItem(BrowserStorageKey.DeRegisterSource);
  }
  ///END LOCAL STORAGE FUNCTIONS


  //START SESSION STORAGE FUNCTIONS
  public SetAllUserRoleId(value: string) {
    sessionStorage.setItem(BrowserStorageKey.AllUserRoleId, value);
  }

  public get AllUserRoleId(): string {
    return sessionStorage.getItem(BrowserStorageKey.AllUserRoleId);
  }

  public RemoveAllUserRoleId(): void {
    sessionStorage.removeItem(BrowserStorageKey.AllUserRoleId);
  }

  public SetAllUserRoleCompanyId(value: string) {
    sessionStorage.setItem(BrowserStorageKey.AllUserRoleCompanyId, value);
  }

  public get AllUserRoleCompanyId(): string {
    return sessionStorage.getItem(BrowserStorageKey.AllUserRoleCompanyId);
  }

  public RemoveAllUserRoleCompanyId(): void {
    sessionStorage.removeItem(BrowserStorageKey.AllUserRoleCompanyId);
  }

  public SetUserRoleId(value: string) {
    sessionStorage.setItem(BrowserStorageKey.UserRoleId, value);
  }

  public get UserRoleId(): string {
    return sessionStorage.getItem(BrowserStorageKey.UserRoleId);
  }

  public RemoveUserRoleId(): void {
    sessionStorage.removeItem(BrowserStorageKey.UserRoleId);
  }

  public SetAllUserId(value: string) {
    sessionStorage.setItem(BrowserStorageKey.AllUserId, value);
  }

  public get AllUserId(): string {
    return sessionStorage.getItem(BrowserStorageKey.AllUserId);
  }

  public RemoveAllUserId() {
    sessionStorage.removeItem(BrowserStorageKey.AllUserId);
  }

  public SetAllUserCompanyId(value: string) {
    sessionStorage.setItem(BrowserStorageKey.AllUserCompanyId, value);
  }

  public get AllUserCompanyId(): string {
    return sessionStorage.getItem(BrowserStorageKey.AllUserCompanyId);
  }

  public RemoveAllUserCompanyId() {
    sessionStorage.removeItem(BrowserStorageKey.AllUserCompanyId);
  }

  public SetAdAuthState(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  public GetAdAuthState(key: string): string {
    return sessionStorage.getItem(key);
  }

  public RemoveAdAuthState(key: string): void {
    sessionStorage.removeItem(key);
  }

  public get MonitorTemplateId(): string {
    return sessionStorage.getItem(BrowserStorageKey.MonitorTemplateId);
  }

  public SetMonitorTemplateIdInSessionStorage(value: string) {
    sessionStorage.setItem(BrowserStorageKey.MonitorTemplateId, value);
  }
  public RemoveMonitorTemplateIdFromSessionStorage(MonitorTemplateId: any) {
    sessionStorage.removeItem(BrowserStorageKey.MonitorTemplateId);
  }

  public SetKioskTemplateIdInSessionStorage(value: string) {
    sessionStorage.setItem(BrowserStorageKey.KioskTemplateId, value);
  }

  public get KioskTemplateId(): string {
    return sessionStorage.getItem(BrowserStorageKey.KioskTemplateId);
  }
  RemoveMobileInterfaceIdFromSessionStorage() {
    sessionStorage.removeItem(BrowserStorageKey.MobileInterfaceId);
  }
  SetMobileInterfaceIdInSessionStorage(mobileInterfaceId: string) {
    sessionStorage.setItem(
      BrowserStorageKey.MobileInterfaceId,
      mobileInterfaceId
    );
  }
  public get MobileInterfaceId(): string {
    return sessionStorage.getItem(BrowserStorageKey.MobileInterfaceId);
  }
  public get kioskExecutionToken() {
    return localStorage.getItem(BrowserStorageKey.kioskExecutionToken);
  }

  public SetKioskExecutionToken(value: kioskData) {
    localStorage.setItem(BrowserStorageKey.kioskExecutionToken, JSON.stringify(value));
  }

  public RemoveKioskExecutionToken() {
    localStorage.removeItem(BrowserStorageKey.kioskExecutionToken);
  }

  public get KioskShutDownDetails() {
    return JSON.parse(
      localStorage.getItem(BrowserStorageKey.KioskShutDownDetails)
    );
  }

  public SetKioskShutDownDetails(value: string) {
    localStorage.setItem(BrowserStorageKey.KioskShutDownDetails, value);
  }

  public RemoveKioskShutDownDetails() {
    localStorage.removeItem(BrowserStorageKey.KioskShutDownDetails);
  }

  public SetLocalStorageItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public GetLocalStorageItem(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  public get CurrentPageViewName() {
    return localStorage.getItem(BrowserStorageKey.CurrentPageViewName);
  }

  public SetCurrentPageViewName(value: string) {
    localStorage.setItem(BrowserStorageKey.CurrentPageViewName, value);
  }

  public RemoveCurrentPageViewName() {
    localStorage.removeItem(BrowserStorageKey.CurrentPageViewName);
  }

  public ClearStorage(): void {
    for (const key in localStorage) {
      if (this.CanRemoveThisItem(key)) {
        localStorage.removeItem(key);
      }
    }
    for (const key of Object.keys(sessionStorage)) {
      sessionStorage.removeItem(key);
    }
  }
  private CanRemoveThisItem(key: string) {
    return (
      !this.ArrayOfNonRemovalBrowserStorageKey.some(
        (storageKey) => storageKey === key
      ) && localStorage.hasOwnProperty(key)
    );
  }

  RemoveKeyValueFromSessionStorage(key: string) {
    sessionStorage.removeItem(key);
  }

  public get HomeInterfaceId(): string {
    return sessionStorage.getItem(BrowserStorageKey.HomeInterfaceId);
  }

  public SetHomeInterfaceIdInSessionStorage(value: string) {
    sessionStorage.setItem(BrowserStorageKey.HomeInterfaceId, value);
  }
  public RemoveHomeInterfaceIdFromSessionStorage() {
    sessionStorage.removeItem(BrowserStorageKey.HomeInterfaceId);
  }

  public setSnapshotBranch(value: string) {
    localStorage.setItem(BrowserStorageKey.SnapShotBranch, value)
  }

  public getSnapshotBranch(): string {
    return localStorage.getItem(BrowserStorageKey.SnapShotBranch);
  }

  public setSnapShotInterval(value: string) {
    localStorage.setItem(BrowserStorageKey.SnapShotInterval, value)
  }

  public getSnapShotInterval(): string {
    return localStorage.getItem(BrowserStorageKey.SnapShotInterval);
  }

  public setSnapShotDate(value: any) {
    localStorage.setItem(BrowserStorageKey.SnapShotDate, JSON.stringify(value))
  }

  public getSnapShotDate(): any {
    return localStorage.getItem(BrowserStorageKey.SnapShotDate);
  }
}
