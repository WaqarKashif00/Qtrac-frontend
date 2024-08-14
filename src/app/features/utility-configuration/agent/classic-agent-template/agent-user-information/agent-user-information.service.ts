import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { AgentStationDataService } from '../../utility-services/services/agent-station-data-service/agent-station-data.service';

@Injectable()
export class AgentUserInformationService extends AbstractComponentService {
    /**
     *
     */
    SubjectUserName: BehaviorSubject<string>;
    SubjectCompanyName: BehaviorSubject<string>;
    SubjectBranchName: BehaviorSubject<string>;
    SubjectUserImageUrl: BehaviorSubject<string>;

    UserName$: Observable<string>;
    CompanyName$: Observable<string>;
    BranchName$: Observable<string>;
    UserImageUrl$: Observable<string>;



    constructor(
        private stationDetailsService: AgentStationDataService) {
        super();
        this.SetObservables();
        this.Initialize();
    }

    SetObservables() {
        this.SubjectUserName = new BehaviorSubject<string>('');
        this.UserName$ = this.SubjectUserName.asObservable();
        this.SubjectCompanyName = new BehaviorSubject<string>(this.authService.CompanyName);
        this.CompanyName$ = this.SubjectCompanyName.asObservable();
        this.SubjectBranchName = new BehaviorSubject<string>('');
        this.BranchName$ = this.SubjectBranchName.asObservable();
        this.SubjectUserImageUrl = new BehaviorSubject<string>('');
        this.UserImageUrl$ = this.SubjectUserImageUrl.asObservable();
    }

    Initialize() {
        this.SubjectUserName.next(this.authService.UserName);
        this.subs.sink = this.stationDetailsService.Get().subscribe(stationDetails => {
            this.SubjectBranchName.next(stationDetails?.Branch?.branchName);
        });

        this.subs.sink = this.mediatorService.InitialUserDetails$.subscribe(InitialUserDetails => {
            const userName = `${InitialUserDetails?.firstName} ${InitialUserDetails?.lastName}`;
            this.SubjectUserName.next(userName);

            this.SubjectUserImageUrl.next(InitialUserDetails?.image);
        });

    }
}
