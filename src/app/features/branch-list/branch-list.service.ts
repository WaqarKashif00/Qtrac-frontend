import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { BranchAPIService } from '../../shared/api-services/branch-api.service';
import { IBranchTag } from '../all-user/models/branch-tag.interface';
import { IBranch } from './models/branch.interface';


@Injectable()
export class BranchListService extends AbstractComponentService {

  BranchList$: Observable<IBranch[]>;
  private BranchListSubject: BehaviorSubject<IBranch[]>;
  BranchTag$: Observable<string[]>;
  private BranchTagSubject: BehaviorSubject<string[]>;

  constructor(private readonly branchAPIService: BranchAPIService) {
    super();
    this.InitializeSubjects();
  }

  private InitializeSubjects() {
    this.BranchListSubject = new BehaviorSubject<IBranch[]>([]);
    this.BranchList$ = this.BranchListSubject.asObservable();
    this.BranchTagSubject = new BehaviorSubject<string[]>([]);
    this.BranchTag$ = this.BranchTagSubject.asObservable();
  }

  public SetBranchList() {
    this.branchAPIService.GetAll(this.authService.CompanyId).subscribe((data: IBranch[]) => {
      this.BranchListSubject.next(data);
    });
  }
 public  SetTagList() {
  this.branchAPIService.GetTags(this.authService.CompanyId).subscribe((data:  string[]) => {
    this.BranchTagSubject.next(data);
  });
  }

  public RedirectToAddNewBranch() {
    this.browserStorageService.RemoveBranchId(); // TODO: need to remove after list creation
    this.routeHandlerService.RedirectToAddNewBranch();
  }

  public RedirectToEditBranch(branchId: string) {
    if (branchId){
    this.browserStorageService.SetBranchId(branchId);
    }
    this.routeHandlerService.RedirectToEditBranch();
  }

  Delete(branch){
    return this.branchAPIService.Delete(this.authService.CompanyId, branch.branchId);
  }

}
