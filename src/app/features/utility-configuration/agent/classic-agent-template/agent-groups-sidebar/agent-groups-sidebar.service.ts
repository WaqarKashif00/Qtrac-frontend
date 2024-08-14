import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { AbstractComponentService } from "src/app/base/abstract-component-service";

@Injectable()
export class AgentGroupsSidebarService extends AbstractComponentService {
 
  constructor() {
    super();

  }

  async ValidateForm(form: FormGroup): Promise<boolean> {
    return this.formService.CallFormMethod<any>(form);
  }

}
