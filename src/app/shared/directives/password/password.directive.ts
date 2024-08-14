import { Directive, ElementRef} from '@angular/core';
@Directive({
  selector: 'input[type=password]'
})
export class PasswordDirective {
  private IsShown = false;
  private EyeSpan: HTMLSpanElement;

  constructor(private el: ElementRef) {
    this.Setup();
  }

  Toggle(span: HTMLElement) {
    this.IsShown = !this.IsShown;
    if (this.IsShown) {
      // this.el.nativeElement.setAttribute('type', 'text');
      this.el.nativeElement.setAttribute('type', 'text');
      this.EyeSpan.classList.remove('eye-icon-password-show');
      this.EyeSpan.classList.add('eye-icon-password-hide');
    } else {
      this.el.nativeElement.setAttribute('type', 'password');
      this.EyeSpan.classList.remove('eye-icon-password-hide');
      this.EyeSpan.classList.add('eye-icon-password-show');
    }
  }

  Setup() {
    const parent = this.el.nativeElement.parentNode;
    this.EyeSpan = document.createElement('span');
    this.EyeSpan.classList.add('eye-icon-password', 'eye-icon-password-show', 'form-control-feedback', 'show-hide-password-eye-icon', 'cursor-pointer');
    this.EyeSpan.addEventListener('click', (event) => {
      this.Toggle(this.EyeSpan);
      });
    parent.classList.add('has-feedback', 'feedback');
    parent.appendChild(this.EyeSpan);
  }
}
