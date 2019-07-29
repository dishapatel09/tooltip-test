import {
  Inject, Directive, Component, ComponentFactoryResolver,
  ViewContainerRef, ElementRef, Input, HostListener, Renderer, OnDestroy
} from "@angular/core";

import { DOCUMENT } from '@angular/platform-browser';

import {
  MOUSEOVER_EVENT, DOM_EVENT, FOCUSIN_EVENT,
  FOCUSOUT_EVENT, MOUSEOUT_EVENT, CLICK_EVENT, ESCAPE_EVENT, SCROLL_EVENT
} from "./constants";

import { ComponentView } from './view';
import { OverlayViewHost, OverlayPositionHost, OffSetModel } from './overlay_view_host';

@Component({
  selector: 'tooltip',
  template: '<div class="tooltip-arrow"></div> <div class="tooltip-inner"> {{tipMessage}}</div>'
})
export class TooltipComponent {
  private message: string;
  @Input() data: any[];

  @Input() set tipMessage(value: string) {
    this.message = value;
  };



  get tipMessage(): string {
    return this.message;
  }
  constructor(public elementRef: ElementRef) { }
}

@Directive({ selector: '[tooltip]', exportAs: 'tooltip' })
export class TooltipDirective implements OnDestroy {
  timeOutId: number;
  componentView: ComponentView<TooltipComponent>;
  overlayViewHost: OverlayViewHost;
  overlayPositionHost: OverlayPositionHost;
  constructor(private renderer: Renderer, private elementRef: ElementRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef, @Inject(DOCUMENT) private document: any
  ) {
    this.overlayViewHost = new OverlayViewHost(document);
    this.overlayPositionHost = new OverlayPositionHost();
  }

  @Input('tooltip') tipPlacement: string
  @Input() tipClass: string;
  @Input() tipMessage: string;
  @Input() tipTrigger: string;
  @Input() set visible(value: boolean) {
    this.visibleTip = value;
  };
  visibleTip: boolean = true;
  @HostListener(MOUSEOVER_EVENT, [DOM_EVENT])
  onMouseOver(e) {
    if (this.tipTrigger === 'hover' && !this.componentView && this.visibleTip && this.isMessageAvailable())
      this.createTooltip();
  };
  @HostListener(FOCUSIN_EVENT, [DOM_EVENT])
  onFocusIn(e) {
    if (this.tipTrigger === 'focus' && !this.componentView && this.visibleTip && this.isMessageAvailable())
      this.createTooltip();
  };

  @HostListener(MOUSEOUT_EVENT, [DOM_EVENT])
  onMouseOut(e) {
    if (this.tipTrigger === 'hover' && this.componentView && this.visibleTip && this.isMessageAvailable())
      this.removeTooltip();
  }
  @HostListener(SCROLL_EVENT, [DOM_EVENT])
  onWindowScroll(e) {
    if ((this.tipTrigger === 'focus' || this.tipTrigger === 'click' || this.tipTrigger === 'validation') && this.componentView && this.visibleTip && this.isMessageAvailable()) {
      this.removeTooltip();
      this.tipPlacement = "bottom";
      this.createTooltip();
    }
  }
  @HostListener(ESCAPE_EVENT, [DOM_EVENT])
  onKeydownHandler(e) {
    if ((this.tipTrigger === 'focus' || this.tipTrigger === 'click' || this.tipTrigger === 'validation') && this.componentView && this.visibleTip && this.isMessageAvailable())
      this.removeTooltip();
  }
  @HostListener(FOCUSOUT_EVENT, [DOM_EVENT])
  onFocusOut(e) {
    if ((this.tipTrigger === 'focus' || this.tipTrigger === 'click' || this.tipTrigger === 'validation') && this.componentView && this.visibleTip && this.isMessageAvailable())
      this.removeTooltip();
  }

  @HostListener(CLICK_EVENT, [DOM_EVENT])
  onClick(e) {
    if ((this.tipTrigger === 'focus' || this.tipTrigger === 'click' || this.tipTrigger === 'validation') && this.componentView && this.visibleTip && this.isMessageAvailable())
      this.removeTooltip();

    if (this.tipTrigger === 'click' && this.visibleTip && this.isMessageAvailable())
      this.createTooltip();
  }

  show() {
    this.createTooltip();
  }

  hide() {
    if (this.componentView)
      this.removeTooltip();
  }

  private createTooltip() {
    this.setOverlay();

    if (this.timeOutId)
      window.clearTimeout(this.timeOutId);
    this.timeOutId = window.setTimeout(() => {
      this.showTip();
    }, 2)
  }

  private setOverlay() {
    var tipElement = this.createTipComponent();
    if (this.tipClass)
      this.overlayViewHost.createElement(['tooltip', 'in', this.tipClass, this.tipPlacement]);
    else
      this.overlayViewHost.createElement(['tooltip', 'in', this.tipPlacement]);

    this.overlayViewHost.appendChild(tipElement);
  }

  private removeTooltip() {
    this.componentView.destroy();
    this.overlayViewHost.destroy();
    this.componentView = undefined;
  }

  private showTip() {
    let offSetModel = new OffSetModel(this.tipPlacement,
      this.overlayPositionHost.getClientRectangle(this.elementRef.nativeElement),
      this.overlayPositionHost.getOffset(this.elementRef.nativeElement),
      this.overlayPositionHost.getOffset(this.overlayViewHost.element));
    var calculatedOffset = this.overlayPositionHost.getCalculatedOffset(offSetModel);
    this.overlayViewHost.applyPlacement(calculatedOffset);
    this.overlayViewHost.addClass("show");
  }

  private createTipComponent(): HTMLElement {
    this.componentView = new ComponentView<TooltipComponent>(TooltipComponent, this.viewContainerRef, this.componentFactoryResolver);
    this.componentView.create({ 'tipMessage': this.tipMessage });
    return this.componentView.rootNode();
  }

  private isMessageAvailable() {
    return this.tipMessage != null && this.tipMessage != undefined && this.tipMessage != '';
  }
  ngOnDestroy(): void {

  }
}
