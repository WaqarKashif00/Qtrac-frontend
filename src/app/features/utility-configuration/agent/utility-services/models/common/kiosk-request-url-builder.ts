import { AbstractComponentService } from 'src/app/base/abstract-component-service';
import { AppConfigService } from 'src/app/core/services/app-config.service';
import { IURLBuilder } from './resource-url-builder.interface';

export class KioskRequestURLBuilder implements IURLBuilder {

    private CompanyId: string;
    private AppConfigService: AppConfigService;

    /**
     *
     */
    constructor(parentService: AbstractComponentService) {
        this.AppConfigService = parentService.appConfigService;
        this.CompanyId = parentService.authService.CompanyId;
    }

    Post(): string {
        throw new Error('Method not implemented.');
    }
    Put(id: string): string {
        throw new Error('Method not implemented.');
    }

    BaseURL(): string {
        return this.AppConfigService.config.AgentTemplateBaseAPIUrl;
    }

    Get(id: string): string {
        return this.BaseURL() + `/api/companies/${this.CompanyId}/agent-templates/${id}`;
    }
}
