import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractService } from 'src/app/base/abstract-service';
import { WorkflowConfigPath } from 'src/app/models/constants/workflow-config-path.constant';

@Injectable({ providedIn: 'root' })
export class RouteHandlerService extends AbstractService {
  constructor(private router: Router) {
    super();
  }

  public RedirectToUnAuthorize() {
    this.router.navigate(['/unauthorize']);
  }

  public RedirectToHome() {
    this.router.navigate(['/home']);
  }
  public RedirectToManage() {
    this.router.navigate(['/manage']);
  }

  public RedirectToMonitorListPage() {
    this.router.navigate(['/manage/monitor-template']);
  }
  public RedirectToLogin(logout:boolean) {

    if(logout)
    {
      if (window.location.origin == 'https://tailoredbrands.qtrac.com') {
        window.location.href = 'https://sso.tailoredbrands.com/login/signout'
      }
      else {
        this.router.navigate(['/login']);
      }
    }
    else
    {
      if (window.location.origin == 'https://tailoredbrands.qtrac.com') {
        window.location.href = 'https://sso.tailoredbrands.com/app/tailoredbrands_waitlistqtrac_1/exk3pv82c2bXpb2IZ697/sso/saml'
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  public RedirectToKioskListPage() {
    this.router.navigate(['/manage/kiosk-template']);
  }

  public RedirectToAddNewKioskPage() {
    this.router.navigate(['/manage/kiosk-template/add-kiosk-template']);
  }

  public RedirectToEditNewKioskPage() {
    this.router.navigate(['/manage/kiosk-template/edit-kiosk-template']);
  }
  public RedirectToBranchList() {
    this.router.navigate(['/manage/branches']);
  }

  public RedirectToAddNewBranch() {
    this.router.navigate(['/manage/branches/add-new-branch']);
  }

  public RedirectToEditBranch() {
    this.router.navigate(['/manage/branches/edit-branch']);
  }

  public RedirectToAddCompany() {
    this.router.navigate(['/manage/companies/add-company']);
  }
  public RedirectToEditCompany() {
    this.router.navigate(['/manage/companies/edit-company']);
  }
  public RedirectToCompany() {
    this.router.navigate(['/manage/companies']);
  }

  public RedirectWorkFlowList() {
    this.router.navigate(['/manage/work-flow']);
  }

  public RedirectToWorkFlowConfigPage() {
    this.router.navigate(['/manage/work-flow/config']);
  }

  public RedirectToWorkFlowBasicWorkflow() {
    this.router.navigate([
      '/manage/work-flow/config/' + WorkflowConfigPath.basicWorkflowRules,
    ]);
  }

  public RedirectToWorkFlowBehavior() {
    this.router.navigate([
      '/manage/work-flow/config/' + WorkflowConfigPath.settings,
    ]);
  }

  public RedirectToWorkFlowGlobalQuestion() {
    this.router.navigate([
      '/manage/work-flow/config/' + WorkflowConfigPath.preServiceQuestions,
    ]);
  }

  public RedirectToWorkFlowService() {
    this.router.navigate([
      '/manage/work-flow/config/' + WorkflowConfigPath.services,
    ]);
  }

  public RedirectToWorkFlowQuestionSet() {
    this.router.navigate([
      '/manage/work-flow/config/' + WorkflowConfigPath.serviceQuestions,
    ]);
  }

  public RedirectToWorkFlowQueue() {
    this.router.navigate([
      '/manage/work-flow/config/' + WorkflowConfigPath.queues,
    ]);
  }

  public RedirectToWorkFlowAppointmentTemplate() {
    this.router.navigate([
      '/manage/work-flow/config/' + WorkflowConfigPath.appointmentTemplates,
    ]);
  }

  public RedirectToHoursOfOperation() {
    this.router.navigate(['/manage/hours-of-operations']);
  }

  public RedirectToAddHoursOfOperation() {
    this.router.navigate([
      '/manage/hours-of-operations/add-hours-of-operations',
    ]);
  }

  public RedirectToUpdateHoursOfOperation() {
    this.router.navigate([
      '/manage/hours-of-operations/edit-hours-of-operations',
    ]);
  }

  RedirectToAddNewMonitorPage() {
    this.router.navigate(['/manage/monitor-template/add-monitor-template']);
  }
  RedirectToEditNewMonitorPage() {
    this.router.navigate(['/manage/monitor-template/edit-monitor-template']);
  }
  public RedirectToAddAgentTemplate() {
    this.router.navigate(['/manage/agent-Template/add-agent-template']);
  }

  public RedirectToEditAgentTemplate() {
    this.router.navigate(['/manage/agent-Template/edit-agent-template']);
  }

  public RedirectToAgentTemplate() {
    this.router.navigate(['/manage/agent-Template']);
  }

  public RedirectToAddAgent() {
    this.router.navigate(['/utility-configuration/agent'], {
      queryParams: { Add: 'Add-Agent' },
    });
  }

  public RedirectToKioskExecutionPage() {
    this.router.navigate(['/kiosk-execution']);
  }

  public RedirectToKioskRegistrationPage() {
    this.router.navigate(['/device-registration']);
  }

  public RedirectToKioskShutdownPage(message: string) {
    this.router.navigate(['/kiosk-shutdown', { message }]);
  }

  public RedirectToMonitorExecutionPage() {
    this.router.navigate(['/monitor-execution']);
  }
  public RedirectToAddNewMobileInterfacePage() {
    this.router.navigate(['/manage/mobile-interfaces/add-mobile-interface']);
  }
  public RedirectToEditNewMobileInterfacePage() {
    this.router.navigate(['/manage/mobile-interfaces/edit-mobile-interface']);
  }
  public RedirectToMobileInterfaceListPage() {
    this.router.navigate(['/manage/mobile-interfaces']);
  }
  public RedirectToAddNewAppointmentSchedulerPage() {
    this.router.navigate([
      '/manage/appointment-scheduler/add-appointment-scheduler',
    ]);
  }
  public RedirectToEditNewAppointmentSchedulerPage() {
    this.router.navigate([
      '/manage/appointment-scheduler/edit-appointment-scheduler',
    ]);
  }
  public RedirectToAppointmentSchedulerPageListPage() {
    this.router.navigate(['/manage/appointment-scheduler']);
  }

  public Redirect(path: string, queryParams?, reload?: boolean) {
    if (queryParams) {
      this.router.navigate([path], { queryParams: queryParams }).then(() => {
        if (reload) location.reload();
      });
    } else {
      this.router.navigate([path]);
    }
  }


  public RedirectForFlorida(path: string, queryParams?) {
    let url = null;

    if (queryParams) {
      url = this.router.serializeUrl(
        this.router.createUrlTree([path], { queryParams: queryParams })
      );
    } else {
      url = this.router.serializeUrl(this.router.createUrlTree([path]));
    }
    window.open(url, "_self");

  }

  public RedirectInNewTab(path: string, queryParams?) {
    let url = null;

    if (queryParams) {
      url = this.router.serializeUrl(
        this.router.createUrlTree([path], { queryParams: queryParams })
      );
    } else {
      url = this.router.serializeUrl(this.router.createUrlTree([path]));
    }
    window.open(url, '_blank');
  }

  public RedirectToSnapShotPage() {
    this.router.navigate(['/snap-shot']);
  }

  public RedirectToSnap2Page() {
    this.router.navigate(['/snap-shot']);
  }

  public RedirectToAgentExecution() {
    this.router.navigate(['/agent']);
  }

  public RedirectToAgentExecutionPage() {
    this.router.navigate(['/agent']);
  }

  public RedirectToHomeInterfaceListPage() {
    this.router.navigate(['/manage/home-interfaces']);
  }

  RedirectToAddNewHomeInterfacePage() {
    this.router.navigate(['/manage/home-interfaces/add-home-interface']);
  }
  RedirectToEditHomeInterfacePage() {
    this.router.navigate(['/manage/home-interfaces/edit-home-interface']);
  }
  RedirectToMobileMonitorPage(path: string) {
    this.router.navigate([path], { replaceUrl: true });
  }
}
