import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { ITextFieldLoaderSettings } from 'src/app/models/common/text-field-loader-settings.interface';

@Directive({
  selector: '[lavi-text-field-loader]'
})
export class TextFieldLoaderDirective implements OnChanges {

  @Input('show-text-field-loading') ShowLoading: boolean;
  @Input('text-field-loading-settings') LoaderSettings: ITextFieldLoaderSettings = {
    TextFiledDivClasses: ['col-lg-12', 'col-md-12']
  };

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.ShowLoading.currentValue != changes.ShowLoading.previousValue &&
      changes.ShowLoading.currentValue != null &&
      changes.ShowLoading.previousValue != null ) {
      (changes.ShowLoading.currentValue ? this.ShowLoader() : this.HideLoader());
    }
  }

  private ShowLoader() {
    const loader = this.el.nativeElement.querySelector('.text-loader');
    if (!loader) {
      const loaderComponent = this.CreateTextFieldLoader();
      loaderComponent != null && this.renderer.appendChild(this.el.nativeElement, loaderComponent);
    }
    this.SetTextFieldSetting();
  }

  private HideLoader() {
    const loader = this.el.nativeElement.querySelector('.text-loader');
    if (loader) {
      this.renderer.removeChild(this.el.nativeElement, loader);
    }
    this.SetTextFieldSetting();

  }

  private CreateTextFieldLoader(): any {
    const loaderSpan = this.GetLoaderElement();
    const childDiv = this.GetChildDiv();
    this.renderer.appendChild(childDiv, loaderSpan);
    const parentDiv = this.GetParentDiv();
    this.renderer.appendChild(parentDiv, childDiv);
    return parentDiv;
  }

  private GetLoaderElement(): any {
    const loaderSpan = this.renderer.createElement('span');
    this.renderer.addClass(loaderSpan, 'sr-only');
    const loaderText = this.renderer.createText('Loading...');
    this.renderer.appendChild(loaderSpan, loaderText);
    return loaderSpan;
  }
  private GetChildDiv(): any {
    const childDivClasses = [
      'spinner-border',
      'text-muted',
      'mt-3'
    ];
    const childDiv = this.renderer.createElement('div');
    childDivClasses.forEach(CDClass => {
      this.renderer.addClass(childDiv, CDClass);
    });
    this.renderer.setAttribute(childDiv, 'role', 'status');
    return childDiv;
  }

  private GetParentDiv() {
    const pDExternalClasses = this.LoaderSettings.LoaderDivClasses || [];
    const parentDivClasses = [
      'col-lg-1',
      'col-md-1',
      'float-right',
      'pl-0',
      'text-loader',
      ...pDExternalClasses
    ];

    const parentDiv = this.renderer.createElement('div');
    parentDivClasses.forEach(PDClass => {
      this.renderer.addClass(parentDiv, PDClass);
    });
    return parentDiv;
  }

  private SetTextFieldSetting() {
    const bootstrapSizeClasses = ['^col-lg-', '^col-sm-', '^col-md-', '^col-'];
    this.LoaderSettings.TextFiledDivClasses.forEach(e => {
      const pattern = new RegExp(bootstrapSizeClasses.join('|'));
      if (pattern.test(e)) {
          this.SetTextFieldSize(e, this.ShowLoading);
      }

    });

  }

  private SetTextFieldSize(bootstrapCol: string, showLoading: boolean) {
    const textField = this.el.nativeElement.querySelector('.lavi-text-field-loader-container');
    const classList = bootstrapCol.split('-');
    const colLength = Number(classList[classList.length - 1]);
    classList.splice(classList.length - 1, 1);
    let classInitials = classList.join('-');
    classInitials += '-';
    this.renderer.removeClass(textField, classInitials + (colLength + ((showLoading) ? 0 : -1)));
    this.renderer.addClass(textField, classInitials + (colLength + ((showLoading) ? -1 : 0)));
  }

}
