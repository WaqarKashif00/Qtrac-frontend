
import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
	selector: '[lavi-ctrl-click]',
})
export class CtrlClickDirective {

	@Output('lavi-ctrl-click') CtrlClickEvent = new EventEmitter<MouseEvent>();
	@Output('click') CtrlEvent = new EventEmitter<MouseEvent>();

	@HostListener('click', ['$event'])
	HandleClick($event: MouseEvent) {
		if ($event.ctrlKey) {
			this.CtrlClickEvent.emit($event);
		}
		else {
			this.CtrlEvent.emit($event);
		}
	}

}
