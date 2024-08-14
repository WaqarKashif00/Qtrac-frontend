import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { delay } from 'rxjs/operators';

export interface DropCoordinates {
  x: number;
  y: number;
}
@Directive({
  // tslint:disable-next-line
  selector: '[lavi-drag-me]',
})
export class DragDirective implements OnInit {

  @Input('lavi-drag-me') IsDragMeRequired: boolean;
  @Input('drag-me-drop-element') DropElement: HTMLElement;

  @Output() OnDrop: EventEmitter<DropCoordinates> = new EventEmitter<DropCoordinates>();

  IsDragging: boolean;

  constructor(private e: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    if (this.IsDragMeRequired) {
      this.renderer.setAttribute(this.e.nativeElement, 'draggable', 'true');
      this.DropElement.addEventListener('dragover', (e: any) => {
        e.preventDefault();
        return false;
      });
      this.DropElement.addEventListener('drop', (e: any) => {
        e.preventDefault();
        if (this.IsDragging) {
          this.IsDragging = false;
          const left = e.pageX;
          const top = e.pageY;
          const y = top - this.DropElement.getBoundingClientRect().top;
          const x = left - this.DropElement.getBoundingClientRect().left;
          this.OnDrop.emit({ x, y });
        }
      });
    }
  }

  @HostListener('dragend', ['$event'])
  OnDragEnd(e) {
    this.IsDragging = false;
    return false;
  }
  @HostListener('dragstart', ['$event'])
  OnDragStart(e) {
    this.IsDragging = true;
  }


}
