import { Injectable } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { AbstractComponentService } from "src/app/base/abstract-component-service";
import { IGeneralSetting } from "../models/general-settings-interface";
import { WorkFlowService } from "../work-flow.service";

@Injectable()
export class GeneralSettingsServices extends AbstractComponentService {

    get GeneralSettingForm(){
        return this.workflowService.GeneralSettingForm
    }
    constructor(private workflowService: WorkFlowService) {
        super();
    }
    
}