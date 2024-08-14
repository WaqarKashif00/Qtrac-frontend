import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
	selector: '[lavi-document-click]',

})
export class DocumentClickDirective {
	@Output('lavi-document-click') ClickOutside = new EventEmitter<ElementRef>();

	constructor(private elementRef: ElementRef) {}

	@HostListener('document:click', ['$event.target'])
	public OnClick(target) {
		const clickedInside = this.elementRef.nativeElement.contains(target);
		if (!clickedInside) {
			this.ClickOutside.emit(target);
		}
	}
}


