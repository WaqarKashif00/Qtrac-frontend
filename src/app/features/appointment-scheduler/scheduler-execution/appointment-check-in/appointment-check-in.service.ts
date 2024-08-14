import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AbstractComponentService } from "src/app/base/abstract-component-service";
import { HaveAppointmentRequestModel } from "src/app/features/utility-configuration/kiosk/kiosk-execution/kiosk-execution.service";
import { KioskAPIService } from "src/app/shared/api-services/kiosk-api.service";

@Injectable()
export class AppointmentCheckInService extends AbstractComponentService{
    CompanyId: string;
    AppointmentBranchId: string;
    CustomerAppointmentId: string;
    MobileInterfaceId: string;

    constructor(
        private router: ActivatedRoute,
        private readonly kioskAPIService: KioskAPIService,
    ){
        super();
        this.Init()
    }
    private Init() {
        this.SetQueryParamsValues();
        this.AddInQueue();
    }

    private AddInQueue() {
        const SaveAppointmentModel: HaveAppointmentRequestModel = {
            appointmentId: this.CustomerAppointmentId,
            branchId: this.AppointmentBranchId,
            mobileInterfaceId: this.MobileInterfaceId
        };
        this.kioskAPIService
            .SaveCustomerRequestByAppointmentExternal<any, any>(this.AppointmentBranchId, SaveAppointmentModel, true).subscribe(response => {
                if (response) {
                    if (response?.ticketNumber) {
                        location.href = `mobile-monitor/${this.CompanyId}/${this.AppointmentBranchId}/${this.MobileInterfaceId}/${response.id}`;
                    }
                }
            });
    }
    
    private SetQueryParamsValues() {
        this.CompanyId = this.router.snapshot.queryParams['c-id'];
        this.AppointmentBranchId = this.router.snapshot.queryParams['b-id'];
        this.CustomerAppointmentId = this.router.snapshot.queryParams['a-id'];
        this.MobileInterfaceId = this.router.snapshot.queryParams['m-id'];
    }
}