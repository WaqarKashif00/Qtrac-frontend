import { Directive, EventEmitter, HostListener, OnDestroy, OnInit, Output, Input } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Directive({
  selector: '[lavi-debounce-click]'
})
export class DebounceClickDirective implements OnInit, OnDestroy {

  @Input('debounce-click-time-interval') TimeInterval: number;

  @Output('lavi-debounce-click') DebounceClick = new EventEmitter();

  private Clicks = new Subject();
  private Subscription: Subscription;

  constructor() { }

  ngOnInit() {
    this.Subscription = this.Clicks.pipe(
      debounceTime(this.TimeInterval)
    ).subscribe(e => {
      this.DebounceClick.emit(e);
    });
  }

  ngOnDestroy() {
    this.Subscription.unsubscribe();
  }

  @HostListener('click', ['$event'])
  ClickEvent(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.Clicks.next(event);
  }
}
