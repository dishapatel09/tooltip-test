import { Component, OnInit } from '@angular/core';
import { TooltipComponent } from '../domain/tooltip_control_directive';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  entryComponents: [TooltipComponent]
})
export class ExampleComponent implements OnInit {
  showTip: boolean = true;
  placement: string = 'top';
  trigger: string = 'click';
  constructor() { }

  ngOnInit() {
  }

}
