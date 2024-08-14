import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractComponent } from 'src/app/base/abstract-component';
import { IAgentCustomersListItem } from '../../models/agent-models';

@Component({
    selector: 'lavi-agent-customer-change-position',
    templateUrl: './agent-customer-change-position.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentCustomerChangePositionComponent extends AbstractComponent {
    @Input() IsDialogOpen: boolean;
    @Input() Customer: IAgentCustomersListItem;

    @Output() OnCancel: EventEmitter<void>;

    ChangePositionForm: FormGroup;

    /**
     *
     */
    constructor(private formBuilder: FormBuilder) {
        super();
        this.OnCancel = new EventEmitter<void>();
        this.InitializeForm();
    }

    private InitializeForm() {
        this.ChangePositionForm = this.formBuilder.group({
            newIndex: [null, [Validators.required]],
        });
        this.ChangePositionForm.reset()
    }

    ChangePosition() {

    }

    Cancel() {
        this.OnCancel.emit()
    }
}
