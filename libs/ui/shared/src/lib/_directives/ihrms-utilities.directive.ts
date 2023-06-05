import { AfterViewInit, Directive, ElementRef, Input, NgModule } from '@angular/core';

@Directive({
  selector: '[ihrmsUtil]',
})
export class IHRMSUtilityDirective implements AfterViewInit {

  @Input() marginLeft: string | undefined;
  @Input() marginRight: string | undefined;
  @Input() marginTop: string | undefined;
  @Input() marginBottom: string | undefined;
  @Input() margin: string | undefined;
  @Input() marginRightAuto: boolean | undefined;

  @Input() paddingLeft: string | undefined;
  @Input() paddingRight: string | undefined;
  @Input() paddingTop: string | undefined;
  @Input() paddingBottom: string | undefined;
  @Input() padding: string | undefined;

  @Input() textAlign: string | undefined;

  @Input() fontSize: number | string | undefined;

  @Input() width: number | string | undefined;
  @Input() height: number | string | undefined;
  @Input() heightCalc: number | string | undefined;

  @Input() noWrap: number | string | undefined;

  @Input() lineHeight: number | string | undefined;

  constructor(
    private el: ElementRef
  ) { }

  ngAfterViewInit(): void {

      this.marginLeft && (this.el.nativeElement.style.marginLeft = `${this.marginLeft}px`);
      this.marginRight && (this.el.nativeElement.style.marginRight = `${this.marginRight}px`);
      this.marginTop && (this.el.nativeElement.style.marginTop = `${this.marginTop}px`);
      this.marginBottom && (this.el.nativeElement.style.marginBottom = `${this.marginBottom}px`);
      this.margin && (this.el.nativeElement.style.margin = `${this.margin}px`);
      this.marginRightAuto && (this.el.nativeElement.style.marginRight = `auto`);

      this.paddingLeft && (this.el.nativeElement.style.paddingLeft = `${this.paddingLeft}px`);
      this.paddingRight && (this.el.nativeElement.style.paddingRight = `${this.paddingRight}px`);
      this.paddingTop && (this.el.nativeElement.style.paddingTop = `${this.paddingTop}px`);
      this.paddingBottom && (this.el.nativeElement.style.paddingBottom = `${this.paddingBottom}px`);
      this.padding && (this.el.nativeElement.style.padding = `${this.padding}px`);

      this.textAlign && (this.el.nativeElement.style.textAlign = `${this.textAlign}`);

      this.fontSize && (this.el.nativeElement.style.fontSize = `${this.fontSize}px`);

      this.width && (this.el.nativeElement.style.width = `${this.width}%`);
      this.height && (this.el.nativeElement.style.height = `${this.height}%`);
      this.heightCalc && (this.el.nativeElement.style.height = `${this.heightCalc}`);

      this.noWrap && (this.el.nativeElement.style.whiteSpace = `nowrap`);

      this.lineHeight && (this.el.nativeElement.style.lineHeight = `${this.lineHeight}`);

  }

}

@NgModule({
  declarations: [ IHRMSUtilityDirective ],
  exports: [ IHRMSUtilityDirective ]
})

export class IHRMSUtilityDirectiveModule {}
