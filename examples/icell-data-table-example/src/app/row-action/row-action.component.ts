import { Component, Input, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'row-action',
  templateUrl: './row-action.component.html',
  styleUrls: ['./row-action.component.scss'],
})
export class RowActionComponent implements OnInit {
  @Input() data: any; // row
  @Input() parent: any; // col.parent

  constructor() {}

  ngOnInit() {}

  navigateToWiki() {
    window.open(`https://en.wikipedia.com/wiki/${this.data.name}`, '_new');
  }
}
